import { useNavigate } from "react-router-dom";
import { getHHMM } from "../../../libs/timetable-utils";
import { RESERVE_DETAIL } from "../../../variables";

interface ReserveBtnProps {
  label: Date;
  userIndex: number;
  member: { id: number; name: string };
  isActiveBorderTop?: boolean;
}

export const ReserveBtn = ({
  label,
  userIndex,
  member,
  isActiveBorderTop = false,
}: ReserveBtnProps) => {
  const navigate = useNavigate();
  return (
    <div
      className={`reserve-btn-box group h-5 ${
        isActiveBorderTop ? " border-t border-gray-200 first:border-t-0" : ""
      }`}
      onClick={() =>
        navigate(RESERVE_DETAIL, { state: { startDate: label, member } })
      }
    >
      <span className="reserve-btn">+ {getHHMM(label, ":")}</span>
    </div>
  );
};
