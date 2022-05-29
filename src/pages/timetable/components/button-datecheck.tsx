import { cls } from "../../../libs/utils";

interface IBtnDatecheck {
  text: string;
  day: number;
  selectedMonth: boolean;
  selectedDate?: boolean;
  onClick?: any;
  isSubheader?: boolean;
}

// FC = Functional Component
export const BtnDatecheck = ({
  text,
  day,
  selectedMonth,
  selectedDate,
  onClick,
  isSubheader,
}: IBtnDatecheck) => (
  <button
    className={cls(
      "mx-auto",
      selectedDate ? "btn-selected" : "",
      day === 0 ? "text-red-600 group-hover:text-red-400" : "",
      day === 6 ? "text-blue-600 group-hover:text-blue-400" : "",
      selectedMonth ? "" : "opacity-40",
      isSubheader ? "btn-ring-off w-full text-center" : "btn-border btn-sm"
    )}
    onClick={onClick}
  >
    {text}
  </button>
);
