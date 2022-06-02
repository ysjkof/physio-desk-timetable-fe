import { Helmet } from "react-helmet-async";
import {
  Clinic,
  Patient,
  Prescription,
  Reservation,
  User,
} from "../../graphql/generated/graphql";
import { useReactiveVar } from "@apollo/client";
import {
  clinicListsVar,
  loggedInUserVar,
  selectedClinicVar,
  selectedDateVar,
  todayNowVar,
  viewOptionsVar,
} from "../../store";
import { useListReservations } from "../../hooks/useListReservations";
import { TimetableTemplate } from "./table-template";
import { useEffect, useState } from "react";
import {
  ClinicMemberWithOptions,
  compareDateMatch,
  compareSameWeek,
  DayWithUsers,
  getSunday,
  getTimeGaps,
  getWeeks,
  injectUsers,
  spreadClinicMembers,
} from "../../libs/timetable-utils";
import { ONE_DAY, TABLE_TIME_GAP } from "../../variables";
import { TableHeader } from "./organisms/table-header";
import { AnimatePresence, motion } from "framer-motion";
import { TableNavExpand } from "./organisms/table-nav-expand";
import { TableNav } from "./organisms/table-nav";
import { TableLabels } from "./organisms/table-labels";
import { TableSubHeader } from "./organisms/table-sub-header";
import { TableRows } from "./organisms/table-rows";
import { TableCols } from "./organisms/table-cols";
import { TableClinicSelector } from "./organisms/table-clinic-selector";
import { TableModals } from "./organisms/table-modal";

export interface PrescriptionWithSelect extends Prescription {
  isSelect: boolean;
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

export interface TimetableModalProps {
  closeAction: () => void;
  refetch: () => void;
}

// 아토믹 디자인에서 페이지
export const TimeTable = () => {
  const today = useReactiveVar(todayNowVar);
  const viewOptions = useReactiveVar(viewOptionsVar);
  const clinicLists = useReactiveVar(clinicListsVar);
  const selectedClinic = useReactiveVar(selectedClinicVar);
  const selectedDate = useReactiveVar(selectedDateVar);
  const loggedInUser = useReactiveVar(loggedInUserVar);
  const [weekEvents, setWeekEvents] = useState<DayWithUsers[] | null>(null);
  const [prevSelectedDate, setPrevSelectedDate] = useState<Date>(today);
  const { data, refetch } = useListReservations();

  const optionalWeekEvents =
    viewOptions.periodToView === ONE_DAY
      ? weekEvents && [weekEvents[selectedDate.getDay()]]
      : weekEvents;

  const labels = getTimeGaps(
    viewOptions.tableDuration.start.hours,
    viewOptions.tableDuration.start.minutes,
    viewOptions.tableDuration.end.hours,
    viewOptions.tableDuration.end.minutes,
    TABLE_TIME_GAP
  );

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
    if (data?.listReservations.ok && loggedInUser) {
      const distributeEvents = distributor(
        data.listReservations.results,
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
  }, [data, clinicLists]);

  useEffect(() => {
    if (!compareDateMatch(selectedDate, prevSelectedDate, "ym")) {
      console.log("✅ 년월이 다르다");
    } else if (
      !compareDateMatch(selectedDate, prevSelectedDate, "d") &&
      !compareSameWeek(selectedDate, prevSelectedDate)
    ) {
      console.log("✅ 년월이 같고 일과 주가 다르다");
    }
    setPrevSelectedDate(selectedDate);
  }, [selectedDate]);

  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | false = false;
    function handleTableHeight() {
      const headerElement = document.getElementById("header");
      const tableHeaderElement = document.getElementById("table-header");
      const height =
        window.innerHeight -
        headerElement?.offsetHeight! -
        tableHeaderElement?.offsetHeight! -
        40;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setHeight(height);
      }, 200);
    }
    handleTableHeight();
    window.addEventListener("resize", handleTableHeight);
    return () => window.removeEventListener("resize", handleTableHeight);
  }, []);

  const tableNavVarients = {
    ini: (isUp: boolean) => ({ y: isUp ? -40 : 30 }),
    start: { y: 0, transition: { type: "tween", duration: 0.3 } },
  };

  return (
    <>
      {!data ? (
        "loading"
      ) : (
        <>
          <Helmet>
            <title>시간표 | Muool</title>
          </Helmet>
          <TimetableTemplate
            children={
              !viewOptions || !optionalWeekEvents || !viewOptions ? (
                <p>
                  불러오는 중입니다. 몇초 뒤에 변화가 없으면 새로고침하세요.
                </p>
              ) : (
                <>
                  <TableHeader today={today} />
                  <AnimatePresence>
                    {viewOptions.navigationExpand ? (
                      <TableNavExpand varients={tableNavVarients} />
                    ) : (
                      <TableNav varients={tableNavVarients} />
                    )}
                  </AnimatePresence>
                  <TableSubHeader weekEvents={optionalWeekEvents} />
                  <AnimatePresence>
                    {viewOptions.seeList === false && (
                      <motion.div
                        initial={{ y: 300 }}
                        animate={{ y: 0, transition: { duration: 0.3 } }}
                        className="table-main"
                        style={{ height: height ? height : "80vh" }}
                      >
                        {/* 시간표의 칸은 table-sub-header, table-cols, table-row 세 곳에서 동일하게 한다 */}
                        <TableLabels labels={labels} />
                        <TableRows
                          labels={labels}
                          weekEvents={optionalWeekEvents}
                        />
                        <TableCols
                          weekEvents={optionalWeekEvents}
                          labels={labels}
                        />
                      </motion.div>
                    )}
                    {viewOptions.seeList === true && "준비 중"}
                    {viewOptions.seeActiveOption && <TableClinicSelector />}
                  </AnimatePresence>
                </>
              )
            }
          />
          <TableModals refetch={refetch} />
        </>
      )}
    </>
  );
};
