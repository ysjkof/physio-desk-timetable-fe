import { useReactiveVar } from "@apollo/client";
import { DayWithUsers } from "../../../libs/timetable-utils";
import { cls } from "../../../libs/utils";
import {
  loggedInUserVar,
  selectedDateVar,
  viewOptionsVar,
} from "../../../store";
import { ONE_DAY } from "../../../variables";
import { BtnDatecheck } from "./button-datecheck";

interface TableSubHeaderProps {
  weekEvents: DayWithUsers[];
}
export function TableSubHeader({ weekEvents }: TableSubHeaderProps) {
  const selectedDate = useReactiveVar(selectedDateVar);
  const loggedInUser = useReactiveVar(loggedInUserVar);
  const viewOptions = useReactiveVar(viewOptionsVar);

  const userLength = weekEvents[0].users.length;
  return (
    <div
      className="table-sub-header sticky top-0 z-[31] grid"
      style={
        viewOptions.periodToView === ONE_DAY
          ? {
              gridTemplateColumns: `2.5rem repeat(1, minmax(${
                userLength * 6
              }rem,1fr))`,
            }
          : {
              gridTemplateColumns: `2.5rem repeat(7, minmax(${
                userLength * 6
              }rem,1fr)`,
            }
      }
    >
      <div className="title-col" />
      {weekEvents.map((day, i) => (
        <div key={i} className="divide-x-2 divide-black bg-white shadow-b">
          <BtnDatecheck
            text={day.date.toLocaleDateString("ko-KR", {
              month: "short",
              day: "numeric",
              weekday: "short",
            })}
            day={day.date.getDay()}
            selectedMonth={selectedDate.getMonth() === day.date.getMonth()}
            selectedDate={selectedDate.getDate() === day.date.getDate()}
            isSubheader
          />
          <div className="mt-1.5 flex">
            {day.users.map(
              (member, userIndex) =>
                member.activation && (
                  <span
                    key={member.id}
                    className={cls(
                      "w-full py-1 text-center",
                      member.user.name === loggedInUser?.name
                        ? "font-semibold"
                        : "",
                      userIndex === 0
                        ? "user-color-1"
                        : userIndex === 1
                        ? "user-color-2"
                        : userIndex === 2
                        ? "user-color-3"
                        : userIndex === 3
                        ? "user-color-4"
                        : userIndex === 4
                        ? "user-color-5"
                        : ""
                    )}
                  >
                    {member.user.name}
                  </span>
                )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
