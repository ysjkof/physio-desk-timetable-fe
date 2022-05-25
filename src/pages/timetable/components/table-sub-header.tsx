import { useReactiveVar } from "@apollo/client";
import { DayWithUsers } from "../../../libs/timetable-utils";
import { cls } from "../../../libs/utils";
import { loggedInUserVar, selectedDateVar } from "../../../store";

interface TableSubHeaderProps {
  weekEvents: DayWithUsers[];
  isWeek: boolean;
}
export function TableSubHeader({ weekEvents, isWeek }: TableSubHeaderProps) {
  const selectedDate = useReactiveVar(selectedDateVar);
  const loggedInUser = useReactiveVar(loggedInUserVar);

  return (
    <div className="table-sub-header mt-1.5 w-full">
      <div
        className={cls(
          "grid",
          isWeek ? "grid-cols-cal_week" : "grid-cols-cal_day"
        )}
      >
        <div className="title-col" />
        {isWeek ? (
          weekEvents.map((day, i) => (
            <div
              key={i}
              className={cls(
                "",
                selectedDate.getMonth() !== day.date.getMonth()
                  ? "opacity-40"
                  : ""
              )}
            >
              <div className="flex h-4 justify-around">
                {day.users.map(
                  (member) =>
                    member.activation && (
                      <div
                        key={member.id}
                        className={cls(
                          member.user.name === loggedInUser?.name
                            ? "font-semibold"
                            : ""
                        )}
                      >
                        {member.user.name}
                      </div>
                    )
                )}
              </div>
            </div>
          ))
        ) : (
          <div
            className={cls(
              "",
              selectedDate.getMonth() !==
                weekEvents[selectedDate.getDay()]?.date.getMonth()
                ? "opacity-40"
                : ""
            )}
          >
            <div className="flex h-4 justify-around">
              {weekEvents[selectedDate.getDay()]?.users.map(
                (user, i) =>
                  user.activation && (
                    <div
                      key={user.id}
                      className={cls(
                        user.user.name === loggedInUser?.name
                          ? "font-semibold"
                          : ""
                      )}
                    >
                      {user.user.name}
                    </div>
                  )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
