import { useReactiveVar } from "@apollo/client";
import { cls } from "../../../libs/utils";
import { selectedDateVar, viewOptionsVar } from "../../../store";
import { BtnArrow } from "./button-arrow";
import { BtnDatecheck } from "./button-datecheck";

interface TableHeaderProps {
  weeks: { date: Date }[];
}
export function TableHeader({ weeks }: TableHeaderProps) {
  const viewOptions = useReactiveVar(viewOptionsVar);
  const selectedDate = useReactiveVar(selectedDateVar);

  const handleDateNavMovePrev = () => {
    const date = new Date(selectedDate);
    viewOptions?.navigationExpand
      ? date.setMonth(date.getMonth() - 1)
      : date.setDate(date.getDate() - 7);
    selectedDateVar(date);
  };
  const handleDateNavMoveNext = () => {
    const date = new Date(selectedDate);
    viewOptions?.navigationExpand
      ? date.setMonth(date.getMonth() + 1)
      : date.setDate(date.getDate() + 7);
    selectedDateVar(date);
  };

  return (
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
              text={
                viewOptions?.periodToView === 7
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
              onClick={() => selectedDateVar(day.date)}
            />
          </div>
        ))}
        <div
          className={cls(
            viewOptions?.navigationExpand ? "invisible" : "",
            "absolute left-0"
          )}
        >
          <BtnArrow direction="prev" onClick={handleDateNavMovePrev} />
        </div>
        <div
          className={cls(
            viewOptions?.navigationExpand ? "invisible" : "",
            "absolute right-0"
          )}
        >
          <BtnArrow direction="after" onClick={handleDateNavMoveNext} />
        </div>
      </div>
    </div>
  );
}
