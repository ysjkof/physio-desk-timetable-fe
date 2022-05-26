import { useReactiveVar } from "@apollo/client";
import { DayWithUsers } from "../../../libs/timetable-utils";
import { cls } from "../../../libs/utils";
import {
  loggedInUserVar,
  selectedDateVar,
  viewOptionsVar,
} from "../../../store";
import { BtnDatecheck } from "./button-datecheck";

interface TableSubHeaderProps {
  weekEvents: DayWithUsers[];
  isWeek: boolean;
}
export function TableSubHeader({ weekEvents, isWeek }: TableSubHeaderProps) {
  const selectedDate = useReactiveVar(selectedDateVar);
  const loggedInUser = useReactiveVar(loggedInUserVar);
  const viewOptions = useReactiveVar(viewOptionsVar);

  return (
    <div
      className={cls(
        "table-sub-header mt-1.5 grid w-full",
        isWeek ? "grid-cols-week divide-x divide-black" : "grid-cols-day"
      )}
    >
      <div className="title-col" />
      {isWeek ? (
        weekEvents.map((day, i) => (
          <div key={i} className="relative flex justify-center">
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
            {/* <span className="absolute w-full bg-gradient-to-r from-[#CCD5AE] via-[#E9EDC9] to-[#FAEDCD] text-center">
            </span> */}
            {day.users.map(
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
        ))
      ) : (
        <div className="relative flex justify-center">
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
      )}
    </div>
  );
}
