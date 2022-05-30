import { useNavigate } from "react-router-dom";
import { getHHMM } from "../../../libs/timetable-utils";
import { RESERVE_DETAIL } from "../../../variables";

interface ReserveBtnProps {
  label: Date;
  userIndex: number;
  member: { id: number; name: string };
}

export const ReserveBtn = ({ label, userIndex, member }: ReserveBtnProps) => {
  const navigate = useNavigate();
  return (
    <div
      className={`reserve-btn-box group relative z-10 w-full ${
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
      onClick={() =>
        navigate(RESERVE_DETAIL, { state: { startDate: label, member } })
      }
    >
      <span className="reserve-btn">+ {getHHMM(label, ":")}</span>
    </div>
  );
};
