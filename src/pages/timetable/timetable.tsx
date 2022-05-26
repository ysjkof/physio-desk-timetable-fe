import { useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  Clinic,
  ListReservationsQuery,
  Patient,
  Prescription,
  Reservation,
  User,
} from "../../graphql/generated/graphql";
import {
  compareDateMatch,
  compareSameWeek,
  getSunday,
  getTimeGaps,
  getWeeks,
  getWeeksOfMonth,
  DayWithUsers,
  injectUsers,
  spreadClinicMembers,
  ClinicMemberWithOptions,
  getHHMM,
} from "../../libs/timetable-utils";
import { ReservationDetail } from "./reservation-detail";
import {
  selectedClinicVar,
  clinicListsVar,
  todayNowVar,
  viewOptionsVar,
  selectedDateVar,
  loggedInUserVar,
} from "../../store";
import { ModalPortal } from "../../components/modal-portal";
import { Reserve } from "./reserve";
import { TimeIndicatorBar } from "./components/time-indicator-bar";
import { PrescriptionWithSelect } from ".";
import { EventLi } from "./components/event-li";

import { TableHeader } from "./components/table-header";
import { TableSubHeader } from "./components/table-sub-header";
import { TableRow } from "./components/table-row";
import { TableCols } from "./components/table-cols";
import { AnimatePresence, motion } from "framer-motion";
import { TableNav } from "./components/table-nav";
import { useMatch, useNavigate } from "react-router-dom";
import { TIMETABLE } from "../../variables";

interface ITimeOption {
  start: { hours: number; minutes: number };
  end: { hours: number; minutes: number };
}

interface ITimetableProps {
  tableTime: ITimeOption;
  eventsData?: ListReservationsQuery;
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
  prescriptions,
  refetch,
}: ITimetableProps) => {
  const isReserve = useMatch("tt/reserve");
  const isEdit = useMatch("tt/edit");
  const navigate = useNavigate();
  const today = useReactiveVar(todayNowVar);
  const [weekEvents, setWeekEvents] = useState<DayWithUsers[]>([]);
  const [weeks, setWeeks] = useState<{ date: Date }[]>(
    getWeeks(getSunday(today))
  );
  const [prevSelectedDate, setPrevSelectedDate] = useState<Date>(today);

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
  const selectedDate = useReactiveVar(selectedDateVar);
  const loggedInUser = useReactiveVar(loggedInUserVar);

  function distributor(
    events: ModifiedReservation[] | undefined | null,
    members: ClinicMemberWithOptions[]
  ) {
    if (!loggedInUser) return;
    let days = injectUsers(
      getWeeks(getSunday(selectedDate)),
      loggedInUser,
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
    if (eventsData?.listReservations.ok && loggedInUser) {
      const distributeEvents = distributor(
        eventsData.listReservations.results,
        spreadClinicMembers(clinicLists, selectedClinic.id)
      );
      if (distributeEvents) {
        setWeekEvents(distributeEvents);
      } else {
        console.error(
          "❌ distributeEvents를 알 수 없습니다 : ",
          distributeEvents
        );
      }
    } else {
      console.warn("✅ 시간표 > useEffect 실패");
    }
  }, [eventsData, clinicLists]);

  useEffect(() => {
    if (!compareDateMatch(selectedDate, prevSelectedDate, "ym")) {
      console.log("✅ 년월이 다르다");
      setWeeks(getWeeks(getSunday(selectedDate)));
    } else if (
      !compareDateMatch(selectedDate, prevSelectedDate, "d") &&
      !compareSameWeek(selectedDate, prevSelectedDate)
    ) {
      console.log("✅ 년월이 같고 일과 주가 다르다");
      setWeeks(getWeeks(getSunday(selectedDate)));
    }
    setPrevSelectedDate(selectedDate);
  }, [selectedDate]);

  if (!viewOptions) {
    return <></>;
  }
  return (
    <>
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="timetable-container h-full text-xs"
      >
        <TableNav today={today} daysOfMonth={getWeeksOfMonth(today)} />
        <TableHeader weeks={weeks} />
        {viewOptions.seeList === false && (
          <>
            {viewOptions.periodToView === 7 && (
              <div className="h-full overflow-y-scroll">
                <TableSubHeader weekEvents={weekEvents} isWeek />
                <div className="body-table relative h-full">
                  <TimeIndicatorBar labels={labels} />
                  <div className="row-table absolute z-30 h-full w-full">
                    {labels.map((label) => (
                      <TableRow
                        key={label.valueOf()}
                        isWeek
                        label={label}
                        weekEvents={weekEvents}
                      />
                    ))}
                  </div>
                  <TableCols weekEvents={weekEvents} isWeek labels={labels} />
                </div>
              </div>
            )}
            {viewOptions.periodToView === 1 && (
              <div className="body-table relative h-full overflow-x-scroll pt-1.5">
                <TableSubHeader weekEvents={weekEvents} isWeek={false} />
                <TimeIndicatorBar labels={labels} />
                <div className="row-table absolute h-full w-full">
                  {labels.map((label) => (
                    <TableRow
                      key={label.valueOf()}
                      isWeek={false}
                      label={label}
                      weekEvents={[weekEvents[selectedDate.getDay()]]}
                    />
                  ))}
                </div>
                <TableCols
                  weekEvents={[weekEvents[selectedDate.getDay()]]}
                  isWeek={false}
                  labels={labels}
                />
              </div>
            )}
          </>
        )}
        {viewOptions.seeList === true &&
          (viewOptions.periodToView === 1 ? (
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
                      onClick={() => "나중에 고칠 것"}
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
                            onClick={() => "나중에 고칠 것"}
                          />
                        ))}
                      </div>
                    ))}
                  </>
                ))}
              </div>
            )
          ))}
      </motion.div>
      <AnimatePresence>
        {isEdit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="fixed top-0 left-0 z-[100] h-screen w-screen bg-black/50 opacity-0"
          >
            <div
              className="modal-background absolute h-full w-full"
              onClick={() => isEdit && navigate(TIMETABLE)}
            />

            <ReservationDetail
              refetch={refetch}
              selectedClinic={selectedClinic}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {isReserve && (
        <ModalPortal
          closeAction={() => isReserve && navigate(TIMETABLE)}
          children={
            <Reserve
              prescriptions={prescriptions}
              refetch={refetch}
              closeAction={() => isReserve && navigate(TIMETABLE)}
            />
          }
        />
      )}
    </>
  );
};
