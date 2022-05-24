import { cls } from "../../../libs/utils";

interface ReserveBtnProps {
  label: Date;
  userIndex: number;
  onClick: () => void;
}

export const ReserveBtn = ({ label, userIndex, onClick }: ReserveBtnProps) => {
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
          : ""
      )}
      onClick={() => onClick()}
    >
      <span className="invisible mx-auto flex flex-col whitespace-nowrap rounded-md bg-gradient-to-r from-sky-500 to-indigo-500 px-0.5 text-center  text-sm font-medium text-white shadow hover:cursor-pointer group-hover:visible">
        +{" "}
        {label.toLocaleString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
};
