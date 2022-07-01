import { useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";
import { getActiveUserLength } from "..";
import {
  DayWithUsers,
  getSunday,
  getWeeks,
  makeDayWithUsers,
  spreadClinicMembers,
} from "../../../libs/timetable-utils";
import { cls } from "../../../libs/utils";
import {
  clinicListsVar,
  loggedInUserVar,
  selectedClinicVar,
  selectedDateVar,
  todayNowVar,
} from "../../../store";
import { NameInSubHeader } from "../molecules/name-in-sub-header";
import { SubHeaderBtn } from "../molecules/sub-header-btn";
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
    <div className="TABLE_SUB_HEADER sticky top-0 z-[32] shadow-b">
      <TableLoopLayout
        userLength={userLength}
        children={userFrame?.map((day, i) => (
          <SubHeaderBtn key={i} date={day.date} userLength={userLength} />
        ))}
      />
      <TableLoopLayout
        userLength={userLength}
        children={userFrame?.map((day, i) => (
          <div
            key={i}
            className={cls(
              "user-cols-divide relative flex items-center bg-white",
              userLength === 1 ? "border-x-inherit" : ""
            )}
          >
            {day?.users.map(
              (member, userIndex) =>
                member.isActivate && (
                  <NameInSubHeader
                    key={userIndex}
                    isMe={member.user.name === logInUser?.name}
                    name={member.user.name}
                    userIndex={userIndex}
                    clinicId={selectedClinic?.id ?? 0}
                    userId={member.user.id}
                    date={day.date}
                  />
                )
            )}
          </div>
        ))}
      />
    </div>
  );
}
