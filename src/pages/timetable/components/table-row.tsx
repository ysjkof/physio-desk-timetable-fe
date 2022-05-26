import { useNavigate } from "react-router-dom";
import {
  compareNumAfterGetMinutes,
  DayWithUsers,
  getHHMM,
} from "../../../libs/timetable-utils";
import { cls } from "../../../libs/utils";
import { RESERVE_DETAIL } from "../../../variables";
import { ReserveBtn } from "./reserve-btn";

interface TableRowProps {
  label: Date;
  weekEvents: DayWithUsers[];
  isWeek: boolean;
}

export function TableRow({ label, weekEvents, isWeek }: TableRowProps) {
  const navigate = useNavigate();
  const onClickRserve = (date: Date, label: Date) => {
    const processedDate = new Date(date);
    processedDate.setHours(label.getHours(), label.getMinutes());
    navigate(RESERVE_DETAIL, { state: { startDate: processedDate } });
  };

  return (
    <div
      className={cls(
        "grid h-5",
        isWeek ? "grid-cols-week divide-x divide-black" : "grid-cols-day",
        compareNumAfterGetMinutes(label, [0, 30]) ? "border-t border-white" : ""
      )}
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
          {day?.users.map((member, userIndex) => (
            <ReserveBtn
              key={member.id}
              label={label}
              userIndex={userIndex}
              onClick={() => onClickRserve(day.date, label)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
