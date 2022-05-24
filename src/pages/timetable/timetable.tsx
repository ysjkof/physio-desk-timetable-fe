import { useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  Clinic,
  ListReservationsQuery,
  MeQuery,
  Patient,
  Prescription,
  Reservation,
  ReservationState,
  User,
} from "../../graphql/generated/graphql";
import {
  compareDateMatch,
  compareNumAfterGetMinutes,
  compareSameWeek,
  getSunday,
  getTimeGaps,
  getWeeks,
  getWeeksOfMonth,
  DayWithUsers,
  injectUsers,
  spreadClinicMembers,
  ClinicMemberWithOptions,
  ClinicWithOptions,
  getHHMM,
  getTimeLength,
} from "../../libs/timetable-utils";
import { cls } from "../../libs/utils";
import {
  LOCALSTORAGE_SELECTED_CLINIC,
  LOCALSTORAGE_VIEW_OPTION_CLINICS,
} from "../../variables";
import { ReservationDetail } from "./reservation-detail";
import {
  selectedClinicVar,
  clinicListsVar,
  todayNowVar,
  viewOptionsVar,
} from "../../store";
import { BtnArrow } from "./components/button-arrow";
import { BtnDatecheck } from "./components/button-datecheck";
import { ModalPortal } from "../../components/modal-portal";
import { Reserve } from "./reserve";
import { TimeIndicatorBar } from "./components/time-indicator-bar";
import { PrescriptionWithSelect } from ".";
import { EventLi } from "./components/event-li";
import { ReserveBtn } from "./components/reserve-btn";
import { EventBox } from "./components/event-box";
import { TableNav } from "./components/table-nav";

interface ITimeOption {
  start: { hours: number; minutes: number };
  end: { hours: number; minutes: number };
}

interface ITimetableProps {
  tableTime: ITimeOption;
  eventsData?: ListReservationsQuery;
  selectedDateState: {
    selectedDate: Date;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  };
  loginUser: MeQuery;
  prescriptions: PrescriptionWithSelect[];
  refetch: () => void;
}
export interface ModifiedReservation
  extends Pick<Reservation, "id" | "startDate" | "endDate" | "state" | "memo"> {
  user: Pick<User, "id" | "name">;
  lastModifier?: Pick<User, "id" | "name" | "email"> | null;
  patient: Pick<
    Patient,
    "id" | "name" | "gender" | "registrationNumber" | "birthday"
  >;
  clinic?: Pick<Clinic, "id" | "name"> | null;
  prescriptions?: Pick<Prescription, "name">[] | null;
}

export const Timetable = ({
  tableTime,
  eventsData,
  selectedDateState: { selectedDate, setSelectedDate },
  loginUser,
  prescriptions,
  refetch,
}: ITimetableProps) => {
  const today = useReactiveVar(todayNowVar);
  const [weekEvents, setWeekEvents] = useState<DayWithUsers[]>([]);
  const [aDay, setADay] = useState<Date>(today);
  const [weeks, setWeeks] = useState<{ date: Date }[]>(
    getWeeks(getSunday(today))
  );
  const [prevSelectedDate, setPrevSelectedDate] = useState<Date>(today);
  const [daysOfMonth, setDaysOfMonth] = useState<{ date: Date }[]>(
    getWeeksOfMonth(today)
  );

  const labels = getTimeGaps(
    tableTime.start.hours,
    tableTime.start.minutes,
    tableTime.end.hours,
    tableTime.end.minutes,
    10
  );
  const clinicLists = useReactiveVar(clinicListsVar);
  const viewOptions = useReactiveVar(viewOptionsVar);
  const selectedClinic = useReactiveVar(selectedClinicVar);

  const handleDateNavMovePrev = () => {
    const date = new Date(selectedDate);
    viewOptions?.navigationExpand
      ? date.setMonth(date.getMonth() - 1)
      : date.setDate(date.getDate() - 7);
    setSelectedDate(date);
  };
  const handleDateNavMoveNext = () => {
    const date = new Date(selectedDate);
    viewOptions?.navigationExpand
      ? date.setMonth(date.getMonth() + 1)
      : date.setDate(date.getDate() + 7);
    setSelectedDate(date);
  };
  const [openEventModal, setOpenEventModal] = useState<boolean>(false);
  const [eventIdForModal, setEventIdForModal] = useState<number | null>(null);
  const onClickEventBox = (eventId: number) => {
    setEventIdForModal(eventId);
    setOpenEventModal(true);
  };
  const [openReserveModal, setOpenReserveModal] = useState<boolean>(false);
  const [eventStartDate, setEventStartDate] = useState<Date>();
  const onClickRserve = (date: Date, label: Date) => {
    const processedDate = new Date(date);
    processedDate.setHours(label.getHours(), label.getMinutes());
    setEventStartDate(processedDate);
    setOpenReserveModal(true);
  };

  function distributor(
    events: ModifiedReservation[] | undefined | null,
    members: ClinicMemberWithOptions[]
  ) {
    console.log("❎ inDistributor", loginUser);
    let days = injectUsers(
      getWeeks(getSunday(selectedDate)),
      loginUser,
      members
    );
    events?.forEach((event) => {
      const dateIndex = days.findIndex((day) =>
        compareDateMatch(day.date, new Date(event.startDate), "ymd")
      );
      if (dateIndex !== -1) {
        const userIndex = days[dateIndex].users.findIndex(
          (member) => member.user.id === event.user.id
        );
        if (userIndex !== -1) {
          days[dateIndex].users[userIndex].events.push(event);
        }
      }
    });
    return days;
  }
  useEffect(() => {
    if (eventsData?.listReservations.ok) {
      const distributeEvents = distributor(
        eventsData.listReservations.results,
        spreadClinicMembers(clinicLists, selectedClinic.id)
      );
      setWeekEvents(distributeEvents);
    }
  }, [eventsData, clinicLists]);

  useEffect(() => {
    if (!compareDateMatch(selectedDate, prevSelectedDate, "ym")) {
      console.log("✅ 년월이 다르다");
      setWeeks(getWeeks(getSunday(selectedDate)));
      setDaysOfMonth(getWeeksOfMonth(selectedDate));
    } else if (
      !compareDateMatch(selectedDate, prevSelectedDate, "d") &&
      !compareSameWeek(selectedDate, prevSelectedDate)
    ) {
      console.log("✅ 년월이 같고 일과 주가 다르다");
      setWeeks(getWeeks(getSunday(selectedDate)));
    }
    setPrevSelectedDate(selectedDate);
    setADay(selectedDate);
  }, [selectedDate]);

  if (!viewOptions) {
    return <></>;
  }
  return (
    <>
      <div className="timetable-container h-full w-full text-xs">
        <TableNav
          today={today}
          selectedDateState={{ selectedDate, setSelectedDate }}
          loginUser={loginUser}
          daysOfMonth={daysOfMonth}
        />
        {viewOptions.seeList === false && (
          <>
            {viewOptions.periodToView === 7 && (
              <>
                <div className="table-header w-full">
                  <div className="grid grid-cols-cal_week">
                    <div className="title-col" />
                    {weeks.map((day, i) => (
                      <div
                        key={i}
                        className={cls(
                          "mx-auto",
                          day.date.getDay() === 0
                            ? "text-red-600 group-hover:text-red-400"
                            : day.date.getDay() === 6
                            ? "text-blue-600 group-hover:text-blue-400"
                            : "text-gray-600 group-hover:text-gray-400",
                          selectedDate.getMonth() !== day.date.getMonth()
                            ? "opacity-40"
                            : ""
                        )}
                      >
                        <BtnDatecheck
                          text={day.date.toLocaleDateString("ko-KR", {
                            month: "short",
                            day: "numeric",
                            weekday: "short",
                          })}
                          day={day.date.getDay()}
                          thisMonth={
                            selectedDate.getMonth() === day.date.getMonth()
                          }
                          selected={
                            selectedDate.getDate() === day.date.getDate()
                          }
                          onClick={() => setSelectedDate(day.date)}
                        />
                      </div>
                    ))}
                    <div
                      className={cls(
                        viewOptions.navigationExpand ? "invisible" : "",
                        "absolute left-0"
                      )}
                    >
                      <BtnArrow
                        direction="prev"
                        onClick={handleDateNavMovePrev}
                      />
                    </div>
                    <div
                      className={cls(
                        viewOptions.navigationExpand ? "invisible" : "",
                        "absolute right-0"
                      )}
                    >
                      <BtnArrow
                        direction="after"
                        onClick={handleDateNavMoveNext}
                      />
                    </div>
                  </div>
                </div>
                {/* -------------  절취선  ------------- */}
                <div className="table-sub-header mt-1.5 w-full">
                  <div className="grid grid-cols-cal_week">
                    <div className="title-col" />
                    {weekEvents.map((day, i) => (
                      <div
                        key={i}
                        className={cls(
                          "",
                          selectedDate.getMonth() !== day.date.getMonth()
                            ? "opacity-40"
                            : ""
                        )}
                      >
                        <div className="flex h-4 justify-around">
                          {day.users.map(
                            (member) =>
                              member.activation && (
                                <div
                                  key={member.id}
                                  className={cls(
                                    member.user.name === loginUser?.me.name
                                      ? "font-semibold"
                                      : ""
                                  )}
                                >
                                  {member.user.name}
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="body-table relative h-full overflow-y-scroll pt-1.5">
                  <TimeIndicatorBar labels={labels} />
                  <div className="row-table absolute z-30 h-full w-full">
                    {labels.map((label) => (
                      <div
                        key={label.valueOf()}
                        className={cls(
                          compareNumAfterGetMinutes(label, [0, 30])
                            ? "border-t border-white"
                            : "",
                          "grid h-5 grid-cols-cal_week divide-x divide-black"
                        )}
                      >
                        <div
                          className={cls(
                            compareNumAfterGetMinutes(label, [0, 30])
                              ? "bg-white"
                              : "",
                            "title-col relative -top-2.5"
                          )}
                        >
                          {compareNumAfterGetMinutes(label, [0, 30])
                            ? getHHMM(label)
                            : ""}
                        </div>
                        {weekEvents.map((day, i) => (
                          <div key={i} className="relative z-30 flex">
                            {day.users.map((member, userIndex) => (
                              <ReserveBtn
                                label={label}
                                userIndex={userIndex}
                                onClick={() => onClickRserve(day.date, label)}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="col-table absolute h-full w-full">
                    <div className="grid h-full grid-cols-cal_week">
                      <div className="title-col" />
                      {weekEvents.map((day, i) => (
                        <div
                          key={i}
                          className="event-col relative grid"
                          style={{
                            gridTemplateColumns: `repeat(${
                              day.users.filter((member) => member.activation)
                                .length
                            }, 1fr)`,
                          }}
                        >
                          {day.users?.map(
                            (member, userIndex) =>
                              member.activation && (
                                <div
                                  key={member.id}
                                  className={cls("user-col relative")}
                                >
                                  {member.events?.map((event) => (
                                    <EventBox
                                      userIndex={userIndex}
                                      viewOptions={viewOptions}
                                      reservationState={event.state}
                                      patientName={event.patient.name}
                                      prescriptions={event.prescriptions ?? []}
                                      inset={`${
                                        labels.findIndex((label) =>
                                          compareDateMatch(
                                            label,
                                            new Date(event.startDate),
                                            "hm"
                                          )
                                        ) * 20
                                      }px 0%`}
                                      height={`${
                                        getTimeLength(
                                          event.startDate,
                                          event.endDate
                                        ) * 2
                                      }px`}
                                      onClick={() => onClickEventBox(event.id)}
                                    />
                                  ))}
                                </div>
                              )
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
            {viewOptions.periodToView === 1 && (
              <>
                <div className="table-header w-full">
                  <div className="grid grid-cols-cal_week">
                    <div className="title-col" />
                    {weeks.map((day, i) => (
                      <div
                        key={i}
                        className={cls(
                          "mx-auto",
                          day.date.getDay() === 0
                            ? "text-red-600 group-hover:text-red-400"
                            : day.date.getDay() === 6
                            ? "text-blue-600 group-hover:text-blue-400"
                            : "text-gray-600 group-hover:text-gray-400",
                          selectedDate.getMonth() !== day.date.getMonth()
                            ? "opacity-40"
                            : ""
                        )}
                      >
                        <BtnDatecheck
                          text={day.date.getDate() + ""}
                          day={day.date.getDay()}
                          thisMonth={
                            selectedDate.getMonth() === day.date.getMonth()
                          }
                          selected={
                            selectedDate.getDate() === day.date.getDate()
                          }
                          onClick={() => setSelectedDate(day.date)}
                        />
                      </div>
                    ))}
                    <div
                      className={cls(
                        viewOptions.navigationExpand ? "invisible" : "",
                        "absolute left-0"
                      )}
                    >
                      <BtnArrow
                        direction="prev"
                        onClick={handleDateNavMovePrev}
                      />
                    </div>
                    <div
                      className={cls(
                        viewOptions.navigationExpand ? "invisible" : "",
                        "absolute right-0"
                      )}
                    >
                      <BtnArrow
                        direction="after"
                        onClick={handleDateNavMoveNext}
                      />
                    </div>
                  </div>
                </div>
                <div className="table-sub-header mt-1.5 w-full">
                  <div className="grid grid-cols-cal_day">
                    <div className="title-col" />
                    <div
                      className={cls(
                        "",
                        selectedDate.getMonth() !==
                          weekEvents[selectedDate.getDay()]?.date.getMonth()
                          ? "opacity-40"
                          : ""
                      )}
                    >
                      <div className="flex h-4 justify-around">
                        {weekEvents[selectedDate.getDay()]?.users.map(
                          (user, i) =>
                            user.activation && (
                              <div
                                key={user.id}
                                className={cls(
                                  user.user.name === loginUser?.me.name
                                    ? "font-semibold"
                                    : ""
                                )}
                              >
                                {user.user.name}
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="body-table relative h-full overflow-x-scroll pt-1.5">
                  <TimeIndicatorBar labels={labels} />
                  <div className="row-table absolute h-full w-full">
                    {labels.map((label) => (
                      <div
                        key={label.valueOf()}
                        className={cls(
                          compareNumAfterGetMinutes(label, [0, 30])
                            ? "border-t"
                            : "",
                          "grid h-5 grid-cols-cal_day"
                        )}
                      >
                        <div
                          className={cls(
                            compareNumAfterGetMinutes(label, [0, 30])
                              ? "border-t bg-white"
                              : "",
                            "title-col relative -top-2.5"
                          )}
                        >
                          {compareNumAfterGetMinutes(label, [0, 30])
                            ? getHHMM(label)
                            : ""}
                        </div>
                        <div className="relative z-30">
                          <div
                            className="group absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center px-0.5 hover:cursor-pointer hover:rounded-md hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-500 hover:shadow"
                            onClick={() => onClickRserve(aDay, label)}
                          >
                            <div className="invisible mx-auto flex flex-col whitespace-nowrap text-sm font-medium text-white group-hover:visible sm:flex-row">
                              <span>
                                {label.toLocaleString("ko-KR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <span>예약하기</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="col-table absolute h-full w-full">
                    <div className="grid h-full grid-cols-cal_day">
                      <div className="title-col" />
                      <div
                        className="event-col relative grid border-x border-black"
                        style={{
                          gridTemplateColumns: `repeat(${
                            weekEvents[selectedDate.getDay()]?.users.length
                          }, 1fr)`,
                        }}
                      >
                        {weekEvents[selectedDate.getDay()]?.users?.map(
                          (user) => (
                            <div key={user.id} className="user-col relative">
                              {user.events?.map((event) => (
                                <div
                                  key={event.id}
                                  onClick={() => onClickEventBox(event.id)}
                                  className={cls(
                                    "absolute z-40 cursor-pointer rounded-md border border-sky-300 bg-sky-100",
                                    !viewOptions.seeCancel &&
                                      event.state === ReservationState.Canceled
                                      ? "hidden"
                                      : !viewOptions.seeNoshow &&
                                        event.state === ReservationState.NoShow
                                      ? "hidden"
                                      : event.state ===
                                          ReservationState.NoShow ||
                                        event.state ===
                                          ReservationState.Canceled
                                      ? "opacity-60"
                                      : "",
                                    event.state === ReservationState.NoShow
                                      ? "noshow-color"
                                      : event.state ===
                                        ReservationState.Canceled
                                      ? "cancel-color"
                                      : ""
                                  )}
                                  style={{
                                    inset: `${
                                      labels.findIndex((label) =>
                                        compareDateMatch(
                                          label,
                                          new Date(event.startDate),
                                          "hm"
                                        )
                                      ) * 20
                                    }px 0%`,
                                    height: `${
                                      getTimeLength(
                                        event.startDate,
                                        event.endDate
                                      ) * 2
                                    }px`,
                                  }}
                                >
                                  {event.patient.name}
                                </div>
                              ))}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
        {viewOptions.seeList === true && viewOptions.periodToView === 1 ? (
          <div className="event-col relative grid border-x border-black">
            <div>
              {selectedDate.toLocaleDateString("ko-KR", {
                month: "short",
                day: "numeric",
                weekday: "short",
              })}
            </div>
            {weekEvents[selectedDate.getDay()].users?.map((user) => (
              <div key={user.id}>
                {user.events?.map((event) => (
                  <EventLi
                    key={event.id}
                    viewOptions={viewOptions}
                    reservationState={event.state}
                    startDate={getHHMM(event.startDate, ":")}
                    patientName={event.patient.name}
                    userName={user.user.name}
                    onClick={() => onClickEventBox(event.id)}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          viewOptions.periodToView === 7 && (
            <div className="event-col relative grid border-x border-black">
              {weekEvents.map((week) => (
                <>
                  <div>
                    {week.date.toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                      weekday: "short",
                    })}
                  </div>
                  {week.users?.map((user) => (
                    <div key={user.id}>
                      {user.events?.map((event) => (
                        <EventLi
                          key={event.id}
                          viewOptions={viewOptions}
                          reservationState={event.state}
                          startDate={getHHMM(event.startDate, ":")}
                          patientName={event.patient.name}
                          userName={user.user.name}
                          onClick={() => onClickEventBox(event.id)}
                        />
                      ))}
                    </div>
                  ))}
                </>
              ))}
            </div>
          )
        )}
      </div>
      {openEventModal && (
        <ModalPortal
          closeAction={setOpenEventModal}
          children={
            <ReservationDetail
              reservationId={eventIdForModal!}
              closeAction={setOpenEventModal}
              refetch={refetch}
              selectedClinic={selectedClinic}
            />
          }
        />
      )}
      {openReserveModal && (
        <ModalPortal
          closeAction={setOpenReserveModal}
          children={
            <Reserve
              startDate={eventStartDate!}
              closeAction={setOpenReserveModal}
              prescriptions={prescriptions}
              refetch={refetch}
            />
          }
        />
      )}
    </>
  );
};
