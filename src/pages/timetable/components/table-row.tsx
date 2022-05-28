import { useReactiveVar } from "@apollo/client";
import {
  combineYMDHM,
  compareNumAfterGetMinutes,
  DayWithUsers,
  getHHMM,
} from "../../../libs/timetable-utils";
import { cls } from "../../../libs/utils";
import { viewOptionsVar } from "../../../store";
import { ONE_DAY } from "../../../variables";
import { ReserveBtn } from "./reserve-btn";

interface TableRowProps {
  label: Date;
  weekEvents: DayWithUsers[];
}

export function TableRow({ label, weekEvents }: TableRowProps) {
  const viewOptions = useReactiveVar(viewOptionsVar);
  console.log(weekEvents);
  if (!weekEvents[0]) {
    // console.log("❌ weekEvents[0]가 false입니다 : ", weekEvents);
    return <h2>Loading...</h2>;
  }
  const userLength = weekEvents[0].users.length;
  return (
    <div
      className={cls(
        "grid h-5 w-full divide-x-2 divide-black",
        compareNumAfterGetMinutes(label, [0, 30])
          ? "border-t border-white"
          : "",
        "first:border-0"
      )}
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
      <div className="title-col relative -top-2.5 z-[33] bg-white">
        {compareNumAfterGetMinutes(label, [0, 30]) ? getHHMM(label) : ""}
      </div>
      {weekEvents.map((day, i) => (
        // id={day.date + ""}로 table-nav에서 스크롤 조정함
        <div key={i} className="relative flex" id={day.date + ""}>
          {day?.users.map(
            (member, userIndex) =>
              member.activation && (
                <ReserveBtn
                  key={userIndex}
                  label={combineYMDHM(day.date, label)}
                  userIndex={userIndex}
                  member={{ id: member.user.id, name: member.user.name }}
                />
              )
          )}
        </div>
      ))}
    </div>
  );
}
