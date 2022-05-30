import { useReactiveVar } from "@apollo/client";
import { selectedDateVar, viewOptionsVar } from "../../../store";
import { BtnArrow } from "./button-arrow";
import { BtnDatecheck } from "./button-datecheck";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  compareDateMatch,
  getSunday,
  getWeeks,
} from "../../../libs/timetable-utils";
import { NEXT, PREV, SCROLL_ADRESS } from "../../../variables";

interface TableNavProps {
  varients: any;
}

export function TableNav({ varients }: TableNavProps) {
  const viewOptions = useReactiveVar(viewOptionsVar);
  const selectedDate = useReactiveVar(selectedDateVar);
  const [weeks, setWeeks] = useState<{ date: Date }[]>(
    getWeeks(getSunday(selectedDate))
  );

  const handleDateNavMovePrev = () => {
    const date = new Date(selectedDate);
    viewOptions.navigationExpand
      ? date.setMonth(date.getMonth() - 1)
      : date.setDate(date.getDate() - 7);
    selectedDateVar(date);
  };
  const handleDateNavMoveNext = () => {
    const date = new Date(selectedDate);
    viewOptions.navigationExpand
      ? date.setMonth(date.getMonth() + 1)
      : date.setDate(date.getDate() + 7);
    selectedDateVar(date);
  };

  useEffect(() => setWeeks(getWeeks(getSunday(selectedDate))), [selectedDate]);

  return (
    <motion.div
      custom={false}
      variants={varients}
      initial="ini"
      animate="start"
      className="table-nav"
    >
      <BtnArrow direction={PREV} onClick={handleDateNavMovePrev} />
      {weeks.map((day, i) => (
        <BtnDatecheck
          key={i}
          text={
            viewOptions.periodToView === 7
              ? day.date.toLocaleDateString("ko-KR", {
                  month: "short",
                  day: "numeric",
                  weekday: "short",
                })
              : day.date.getDate() + ""
          }
          day={day.date.getDay()}
          selectedMonth={compareDateMatch(selectedDate, day.date, "ym")}
          isToday={compareDateMatch(selectedDate, day.date, "ymd")}
          onClick={() => {
            // table-row의 요소를 불러와 스크롤 조절함
            const el = document.getElementById(SCROLL_ADRESS + day.date);
            el?.scrollIntoView({
              block: "center",
              inline: "center",
              behavior: "smooth",
            });
            selectedDateVar(day.date);
          }}
        />
      ))}
      <BtnArrow direction={NEXT} onClick={handleDateNavMoveNext} />
    </motion.div>
  );
}
