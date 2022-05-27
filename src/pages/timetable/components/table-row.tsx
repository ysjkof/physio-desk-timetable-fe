import { useReactiveVar } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import {
  compareNumAfterGetMinutes,
  DayWithUsers,
  getHHMM,
} from "../../../libs/timetable-utils";
import { cls } from "../../../libs/utils";
import { viewOptionsVar } from "../../../store";
import { ONE_DAY, RESERVE_DETAIL } from "../../../variables";
import { ReserveBtn } from "./reserve-btn";

interface TableRowProps {
  label: Date;
  weekEvents: DayWithUsers[];
  isWeek: boolean;
}

export function TableRow({ label, weekEvents, isWeek }: TableRowProps) {
  const navigate = useNavigate();
  const viewOptions = useReactiveVar(viewOptionsVar);
  const onClickRserve = (date: Date, label: Date) => {
    const processedDate = new Date(date);
    processedDate.setHours(label.getHours(), label.getMinutes());
    navigate(RESERVE_DETAIL, { state: { startDate: processedDate } });
  };
  if (!weekEvents[0]) {
    // console.log("❌ weekEvents[0]가 false입니다 : ", weekEvents);
    return <h2>Loading...</h2>;
  }
  const userLength = weekEvents[0].users.length;
  return (
    <div
      className={cls(
        "grid h-5 w-full",
        compareNumAfterGetMinutes(label, [0, 30]) ? "border-t border-white" : ""
      )}
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
      <div
        className={cls(
          "title-col relative -top-2.5",
          compareNumAfterGetMinutes(label, [0, 30]) ? "bg-white" : ""
        )}
      >
        {compareNumAfterGetMinutes(label, [0, 30]) ? getHHMM(label) : ""}
      </div>
      {weekEvents.map((day, i) => (
        <div key={i} className={cls("relative z-30 flex")}>
          {day?.users.map(
            (member, userIndex) =>
              member.activation && (
                <ReserveBtn
                  key={member.id}
                  label={label}
                  userIndex={userIndex}
                  onClick={() => onClickRserve(day.date, label)}
                />
              )
          )}
        </div>
      ))}
    </div>
  );
}
