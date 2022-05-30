import { useReactiveVar } from "@apollo/client";
import { DayWithUsers } from "../../../libs/timetable-utils";
import { loggedInUserVar, selectedDateVar } from "../../../store";
import { BtnDatecheck } from "./button-datecheck";
import { TableLoopLayout } from "./table-loop-layout";
import { TableMainComponentLayout } from "./table-main-component-layout";

interface TableSubHeaderProps {
  weekEvents: DayWithUsers[];
}
export function TableSubHeader({ weekEvents }: TableSubHeaderProps) {
  const selectedDate = useReactiveVar(selectedDateVar);
  const loggedInUser = useReactiveVar(loggedInUserVar);
  const userLength = weekEvents[0].users.length;
  return (
    <TableMainComponentLayout componentName="table-sub-header" isTitle>
      <div className="sticky top-0 z-[31]">
        <TableLoopLayout
          isDivide={false}
          userLength={userLength}
          children={weekEvents.map((day, i) => (
            // id={day.date + ""}로 table-nav에서 스크롤 조정함
            <div key={i} className="relative flex bg-white" id={day.date + ""}>
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
            </div>
          ))}
        />
        <TableLoopLayout
          userLength={userLength}
          children={weekEvents.map((day, i) => (
            // id={day.date + ""}로 table-nav에서 스크롤 조정함
            <div key={i} className="relative flex shadow-b" id={day.date + ""}>
              {day?.users.map(
                (member, userIndex) =>
                  member.activation && (
                    <span
                      key={member.id}
                      className={`w-full py-1 text-center first:border-l-0 ${
                        member.user.name === loggedInUser?.name
                          ? "font-semibold"
                          : ""
                      } ${
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
                      }
        `}
                    >
                      {member.user.name}
                    </span>
                  )
              )}
            </div>
          ))}
        />
      </div>
    </TableMainComponentLayout>
  );
}
