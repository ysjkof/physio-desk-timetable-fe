import { Helmet } from "react-helmet-async";
import { useReactiveVar } from "@apollo/client";
import {
  clinicListsVar,
  IListReservation,
  IMemberWithActivate,
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
  compareDateMatch,
  compareSameWeek,
  DayWithUsers,
  getSunday,
  getTimeGaps,
  getWeeks,
  makeDayWithUsers,
  spreadClinicMembers,
} from "../../libs/timetable-utils";
import { ONE_DAY, TABLE_TIME_GAP } from "../../variables";
import { TableHeader } from "./organisms/table-header";
import { AnimatePresence, motion } from "framer-motion";
import { TableNavExpand } from "./organisms/table-nav-expand";
import { TableNav } from "./organisms/table-nav";
import { TableLabels } from "./organisms/table-labels";
import { TableSubHeader } from "./organisms/table-sub-header";
import { TableCols } from "./organisms/table-cols";
import { TableClinicSelector } from "./organisms/table-clinic-selector";
import { TableModals } from "./organisms/table-modal";
import { Loading } from "../../components/atoms/loading";

export interface TimetableModalProps {
  closeAction: () => void;
  refetch: () => void;
}

export const getActiveUserLength = (members?: IMemberWithActivate[]) =>
  members?.filter((user) => user.isActivate).length ?? 0;

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

  let userLength = 0;

  const labels = getTimeGaps(
    viewOptions.tableDuration.start.hours,
    viewOptions.tableDuration.start.minutes,
    viewOptions.tableDuration.end.hours,
    viewOptions.tableDuration.end.minutes,
    TABLE_TIME_GAP
  );

  function distributor(events: IListReservation[]) {
    if (!loggedInUser) return;

    const userFrame = makeDayWithUsers(
      spreadClinicMembers(clinicLists, selectedClinic!.id),
      getWeeks(getSunday(selectedDate))
    );
    events?.forEach((event) => {
      const dateIndex = userFrame.findIndex((day) =>
        compareDateMatch(day.date, new Date(event.startDate), "ymd")
      );
      if (dateIndex !== -1) {
        const userIndex = userFrame[dateIndex].users.findIndex(
          (member) => member.user.id === event.user.id
        );
        if (userIndex !== -1) {
          userFrame[dateIndex].users[userIndex].events.push(event);
        }
      }
    });
    return userFrame;
  }

  useEffect(() => {
    userLength = getActiveUserLength(selectedClinic?.members);
  }, [selectedClinic]);

  useEffect(() => {
    if (data?.listReservations.ok && loggedInUser) {
      const { results } = data.listReservations;
      const distributeEvents = distributor(results!);
      if (distributeEvents) {
        setWeekEvents(distributeEvents);
      } else {
        console.error(
          "❌ distributeEvents를 알 수 없습니다 : ",
          distributeEvents
        );
      }
    } else {
      console.warn(
        `✅ 시간표 > useEffect 실패; data is:${data?.listReservations.ok}; loggedInUser:${loggedInUser?.id}`
      );
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

  const tableNavVarients = {
    ini: (isUp: boolean) => ({ y: isUp ? -40 : 30 }),
    start: { y: 0, transition: { type: "tween", duration: 0.3 } },
  };

  return (
    <>
      <Helmet>
        <title>시간표 | Muool</title>
      </Helmet>
      <TimetableTemplate
        children={
          !viewOptions || !optionalWeekEvents || !viewOptions ? (
            <Loading />
          ) : (
            <>
              <TableHeader today={today} />
              <AnimatePresence>
                {viewOptions.navigationExpand ? (
                  <TableNavExpand varients={tableNavVarients} />
                ) : (
                  userLength > 1 && <TableNav varients={tableNavVarients} />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {viewOptions.seeList === false && (
                  <div className="TABLE_BODY flex h-screen border-t pb-[21px]">
                    <motion.div
                      initial={{ y: 300 }}
                      animate={{ y: 0, transition: { duration: 0.3 } }}
                      className="TABLE_MAIN table-main overflow-scroll"
                    >
                      {/* 시간표의 칸은 table-sub-header, table-cols, table-row 세 곳에서 동일하게 한다 */}
                      <TableSubHeader />
                      <TableLabels labels={labels} />
                      <TableCols
                        labels={labels}
                        weekEvents={optionalWeekEvents}
                      />
                    </motion.div>
                    {viewOptions.seeActiveOption && <TableClinicSelector />}
                  </div>
                )}
              </AnimatePresence>
              {viewOptions.seeList === true && "준비 중"}
            </>
          )
        }
      />
      <TableModals refetch={refetch} />
    </>
  );
};
