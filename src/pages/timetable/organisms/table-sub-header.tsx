import { useReactiveVar } from "@apollo/client";
import { compareDateMatch, DayWithUsers } from "../../../libs/timetable-utils";
import { loggedInUserVar, selectedDateVar } from "../../../store";
import { SCROLL_ADRESS } from "../../../variables";
import { BtnDatecheck } from "../molecules/button-datecheck";
import { TableLoopLayout } from "./templates/table-loop-layout";
import { TableMainComponentLayout } from "./templates/table-main-component-layout";

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
            <div
              key={i}
              className="relative flex bg-white"
              id={`${SCROLL_ADRESS + day.date}`}
            >
              <BtnDatecheck
                text={day.date.toLocaleDateString("ko-KR", {
                  month: "short",
                  day: "numeric",
                  weekday: "short",
                })}
                day={day.date.getDay()}
                selectedMonth={compareDateMatch(selectedDate, day.date, "ym")}
                isToday={compareDateMatch(selectedDate, day.date, "ymd")}
                isSubheader
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
            </div>
          ))}
        />
        <TableLoopLayout
          userLength={userLength}
          children={weekEvents.map((day, i) => (
            <div
              key={i}
              className="relative flex items-center bg-white shadow-b"
            >
              {day?.users.map(
                (member, userIndex) =>
                  member.activation && (
                    <span
                      key={member.id}
                      className={`flex h-full w-full items-center justify-center first:border-l-0 ${
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
                      }`}
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
