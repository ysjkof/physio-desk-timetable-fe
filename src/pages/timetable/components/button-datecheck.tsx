import { cls } from "../../../libs/utils";

interface IBtnDatecheck {
  text: string;
  day: number;
  thisMonth: boolean;
  selected?: boolean;
  onClick?: any;
  isSubheader?: boolean;
}

// FC = Functional Component
export const BtnDatecheck = ({
  text,
  day,
  thisMonth,
  selected,
  onClick,
  isSubheader,
}: IBtnDatecheck) => (
  <button
    className={cls(
      selected ? "btn-selected" : "",
      day === 0 ? "text-red-600" : "",
      day === 6 ? "text-blue-600" : "",
      thisMonth ? "" : "opacity-40",
      isSubheader ? "w-full text-center" : "btn-border btn-sm"
    )}
    onClick={onClick}
  >
    {text}
  </button>
);
