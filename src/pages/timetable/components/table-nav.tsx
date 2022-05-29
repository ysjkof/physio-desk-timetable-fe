import { useReactiveVar } from "@apollo/client";
import { cls } from "../../../libs/utils";
import { selectedDateVar, viewOptionsVar } from "../../../store";
import { BtnArrow } from "./button-arrow";
import { BtnDatecheck } from "./button-datecheck";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getSunday, getWeeks } from "../../../libs/timetable-utils";

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
      className="my-4 w-full pb-4 shadow-b"
    >
      <div className="grid grid-cols-header">
        <div className="title-col" />
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
            selectedMonth={selectedDate.getMonth() === day.date.getMonth()}
            selectedDate={selectedDate.getDate() === day.date.getDate()}
            onClick={() => {
              // table-row의 요소를 불러와 스크롤 조절함
              const el = document.getElementById(day.date + "");
              el?.scrollIntoView({
                block: "center",
                inline: "center",
                behavior: "smooth",
              });
              selectedDateVar(day.date);
            }}
          />
        ))}
        <div
          className={cls(
            viewOptions.navigationExpand ? "invisible" : "",
            "absolute left-0"
          )}
        >
          <BtnArrow direction="prev" onClick={handleDateNavMovePrev} />
        </div>
        <div
          className={cls(
            viewOptions.navigationExpand ? "invisible" : "",
            "absolute right-0"
          )}
        >
          <BtnArrow direction="after" onClick={handleDateNavMoveNext} />
        </div>
      </div>
    </motion.div>
  );
}
