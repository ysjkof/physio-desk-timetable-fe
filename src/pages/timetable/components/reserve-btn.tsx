import { useNavigate } from "react-router-dom";
import { getHHMM } from "../../../libs/timetable-utils";
import { cls } from "../../../libs/utils";
import { RESERVE_DETAIL } from "../../../variables";

interface ReserveBtnProps {
  label: Date;
  userIndex: number;
}

export const ReserveBtn = ({ label, userIndex }: ReserveBtnProps) => {
  const navigate = useNavigate();
  return (
    <div
      className={cls(
        "group relative w-full",
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
      )}
      onClick={() => navigate(RESERVE_DETAIL, { state: { startDate: label } })}
    >
      <span className="invisible mx-auto flex flex-col whitespace-nowrap bg-gradient-to-r from-sky-500 to-indigo-500 px-0.5 text-center  text-sm font-medium text-white shadow hover:cursor-pointer group-hover:visible">
        + {getHHMM(label, ":")}
      </span>
    </div>
  );
};
