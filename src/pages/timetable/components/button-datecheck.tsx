import { cls } from "../../../libs/utils";

interface IBtnDatecheck {
  text: string;
  day: number;
  thisMonth: boolean;
  selected: boolean;
  onClick?: any;
}

// FC = Functional Component
export const BtnDatecheck = ({
  text,
  day,
  thisMonth,
  selected,
  onClick,
}: IBtnDatecheck) => (
  <button
    className={cls(
      "btn-sm btn-border",
      selected ? "btn-selected" : "",
      day === 0 ? "text-red-600" : "",
      day === 6 ? "text-blue-600" : "",
      thisMonth ? "" : "opacity-40"
    )}
    onClick={onClick}
  >
    {text}
  </button>
);
