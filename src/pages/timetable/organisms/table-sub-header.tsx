import { useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";
import { getActiveUserLength } from "..";
import {
  compareDateMatch,
  DayWithUsers,
  getSunday,
  getWeeks,
  makeDayWithUsers,
  spreadClinicMembers,
} from "../../../libs/timetable-utils";
import {
  clinicListsVar,
  loggedInUserVar,
  selectedClinicVar,
  selectedDateVar,
} from "../../../store";
import { SCROLL_ADRESS, USER_COLORS } from "../../../variables";
import { BtnDatecheck } from "../molecules/button-datecheck";
import { TableLoopLayout } from "./templates/table-loop-layout";
import { TableMainComponentLayout } from "./templates/table-main-component-layout";

interface TableSubHeaderProps {}
export function TableSubHeader({}: TableSubHeaderProps) {
  const selectedDate = useReactiveVar(selectedDateVar);
  const loggedInUser = useReactiveVar(loggedInUserVar);
  const clinicLists = useReactiveVar(clinicListsVar);
  const selectedClinic = useReactiveVar(selectedClinicVar);
  const [userFrame, setUserFrame] = useState<DayWithUsers[] | null>(null);
  const userLength = userFrame && getActiveUserLength(userFrame[0].users);

  useEffect(() => {
    if (loggedInUser) {
      const userFrame = makeDayWithUsers(
        spreadClinicMembers(clinicLists, selectedClinic!.id),
        getWeeks(getSunday(selectedDate))
      );
      setUserFrame(userFrame);
    }
  }, [clinicLists, selectedDate, selectedClinic]);

  if (!userLength) return <></>;
  return (
    <TableMainComponentLayout componentName="TABLE_SUB_HEADER" isTitle>
      <div className="sticky top-0 z-[31]">
        <TableLoopLayout
          isDivide
          userLength={userLength}
          children={userFrame?.map((day, i) => (
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
          children={userFrame?.map((day, i) => (
            <div
              key={i}
              className="relative flex items-center bg-white shadow-b"
            >
              {day?.users.map((member, userIndex) =>
                member.isActivate ? (
                  <span
                    key={member.id}
                    className={`flex h-full w-full items-center justify-center  first:border-l-0  ${
                      member.user.name === loggedInUser?.name
                        ? " font-semibold"
                        : ""
                    }`}
                  >
                    <span
                      className="mr-1 h-2 w-2 rounded-full"
                      style={{ backgroundColor: USER_COLORS[0][userIndex] }}
                    />
                    {member.user.name}
                  </span>
                ) : (
                  ""
                )
              )}
            </div>
          ))}
        />
      </div>
    </TableMainComponentLayout>
  );
}
