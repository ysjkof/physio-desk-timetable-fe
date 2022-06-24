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
import { SCROLL_ADRESS } from "../../../variables";
import { BtnDatecheck } from "../molecules/button-datecheck";
import { NameInSubHeader } from "../molecules/name-in-sub-header";
import { TableLoopLayout } from "./templates/table-loop-layout";

interface TableSubHeaderProps {}
export function TableSubHeader({}: TableSubHeaderProps) {
  const selectedDate = useReactiveVar(selectedDateVar);
  const logInUser = useReactiveVar(loggedInUserVar);
  const clinicLists = useReactiveVar(clinicListsVar);
  const selectedClinic = useReactiveVar(selectedClinicVar);
  const [userFrame, setUserFrame] = useState<DayWithUsers[] | null>(null);
  const userLength = userFrame && getActiveUserLength(selectedClinic?.members);

  useEffect(() => {
    if (logInUser) {
      const userFrame = makeDayWithUsers(
        spreadClinicMembers(clinicLists, selectedClinic!.id),
        getWeeks(getSunday(selectedDate))
      );
      setUserFrame(userFrame);
    }
  }, [clinicLists, selectedDate, selectedClinic]);

  if (!userLength) return <></>;
  return (
    <div className="TABLE_SUB_HEADER sticky top-0 z-[31] border-b border-blue-800">
      <TableLoopLayout
        userLength={userLength}
        children={userFrame?.map((day, i) => (
          // id={day.date + ""}로 table-nav에서 스크롤 조정함
          <div
            key={i}
            className="relative flex bg-white pt-2"
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
          <div key={i} className="relative flex items-center bg-white">
            {day?.users.map((member, userIndex) =>
              member.isActivate ? (
                <NameInSubHeader
                  isMe={member.user.name === logInUser?.name}
                  name={member.user.name}
                  userIndex={userIndex}
                />
              ) : (
                ""
              )
            )}
          </div>
        ))}
      />
    </div>
  );
}
