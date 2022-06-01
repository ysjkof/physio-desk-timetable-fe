import { useReactiveVar } from "@apollo/client";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  compareDateMatch,
  getWeeksOfMonth,
} from "../../../libs/timetable-utils";
import { selectedDateVar } from "../../../store";
import { NEXT, PREV } from "../../../variables";
import { BtnArrow } from "./button-arrow";

interface TableNavExpandProps {
  varients: any;
}

export function TableNavExpand({ varients }: TableNavExpandProps) {
  const selectedDate = useReactiveVar(selectedDateVar);
  const [daysOfMonths, setDaysOfMonths] = useState<
    [{ date: Date }[], { prev: Date; thisMonth: Date; next: Date }]
  >([getWeeksOfMonth(selectedDate), getThreeDate(selectedDate)]);

  function getThreeDate(date: Date) {
    const prevMonth = new Date(date);
    const thisMonth = new Date(date);
    const nextMonth = new Date(date);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return { prev: prevMonth, thisMonth, next: nextMonth };
  }

  const onClickMoveX = (option: typeof PREV | typeof NEXT) => {
    const months = getWeeksOfMonth(daysOfMonths[1][option]);
    const threeDate = getThreeDate(daysOfMonths[1][option]);
    setDaysOfMonths([months, threeDate]);
  };

  return (
    <motion.div
      className="table-nav pt-6"
      custom={true}
      variants={varients}
      initial="ini"
      animate="start"
    >
      <span className="position-center-x pointer-events-none absolute -top-1 text-base font-semibold">
        {daysOfMonths[0][7].date.getMonth() + 1}월
      </span>
      <BtnArrow direction={PREV} onClick={() => onClickMoveX(PREV)} />
      <div className="grid w-full grid-cols-7 gap-x-4">
        {daysOfMonths[0].map((day, i) => (
          <div
            key={i}
            onClick={() => selectedDateVar(day.date)}
            className={`btn-menu cursor-pointer py-0.5 text-center ${
              compareDateMatch(day.date, selectedDate, "ymd")
                ? "emphasize-ring"
                : ""
            }`}
          >
            <span
              className={`${
                day.date.getDay() === 0
                  ? "sunday"
                  : day.date.getDay() === 6
                  ? "saturday"
                  : ""
              } ${
                compareDateMatch(selectedDate, day.date, "ym")
                  ? ""
                  : "opacity-50"
              }`}
            >
              {day.date.getDate()}
            </span>
          </div>
        ))}
      </div>
      <BtnArrow direction={NEXT} onClick={() => onClickMoveX(NEXT)} />
    </motion.div>
  );
}
