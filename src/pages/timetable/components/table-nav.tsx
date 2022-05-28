import { useReactiveVar } from "@apollo/client";
import { cls } from "../../../libs/utils";
import { selectedDateVar, viewOptionsVar } from "../../../store";
import { BtnArrow } from "./button-arrow";
import { BtnDatecheck } from "./button-datecheck";
import { motion } from "framer-motion";

interface TableNavProps {
  weeks: { date: Date }[];
  varients: any;
}

export function TableNav({ weeks, varients }: TableNavProps) {
  const viewOptions = useReactiveVar(viewOptionsVar);
  const selectedDate = useReactiveVar(selectedDateVar);

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
              thisMonth={selectedDate.getMonth() === day.date.getMonth()}
              selected={selectedDate.getDate() === day.date.getDate()}
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
          </div>
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
