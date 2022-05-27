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
  isWeek: boolean;
}
export function TableSubHeader({ weekEvents, isWeek }: TableSubHeaderProps) {
  const selectedDate = useReactiveVar(selectedDateVar);
  const loggedInUser = useReactiveVar(loggedInUserVar);
  const viewOptions = useReactiveVar(viewOptionsVar);
  if (!weekEvents[0]) {
    // console.log("❌ weekEvents[0]가 false입니다 : ", weekEvents);
    return <h2>Loading...</h2>;
  }
  const userLength = weekEvents[0].users.length;
  return (
    <div
      className={cls("table-sub-header grid w-full")}
      style={
        viewOptions.periodToView === ONE_DAY
          ? {
              gridTemplateColumns:
                userLength > 4
                  ? `2.5rem repeat(1, minmax(${userLength * 6}rem,1fr))`
                  : `2.5rem repeat(1, ${userLength}fr)`,
            }
          : {
              gridTemplateColumns:
                userLength > 2
                  ? `2.5rem repeat(7, ${userLength * 6}rem)`
                  : `2.5rem repeat(7, ${userLength}fr)`,
            }
      }
    >
      <div className="title-col" />
      {isWeek ? (
        weekEvents.map((day, i) => (
          <div key={i} className="">
            <BtnDatecheck
              text={day.date.toLocaleDateString("ko-KR", {
                month: "short",
                day: "numeric",
                weekday: "short",
              })}
              day={day.date.getDay()}
              thisMonth={selectedDate.getMonth() === day.date.getMonth()}
              selected={selectedDate.getDate() === day.date.getDate()}
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
                          : ""
                      )}
                    >
                      {member.user.name}
                    </span>
                  )
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="">
          <BtnDatecheck
            text={selectedDate.toLocaleDateString("ko-KR", {
              month: "short",
              day: "numeric",
              weekday: "short",
            })}
            day={selectedDate.getDay()}
            thisMonth={selectedDate.getMonth() === selectedDate.getMonth()}
            isSubheader
          />
          <div className="mt-1.5 flex">
            {weekEvents[selectedDate.getDay()]?.users.map(
              (member, userIndex) =>
                member.activation && (
                  <span
                    key={member.id}
                    className={cls(
                      "mt-4 w-full py-1 text-center",
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
                        : ""
                    )}
                  >
                    {member.user.name}
                  </span>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
