import React from "react";
import { cls } from "../libs/utils";

interface IBtnDatecheck {
  text: string;
  day: number;
  thisMonth: boolean;
  selected: boolean;
  onClick?: any;
}

// FC = Functional Component
export const BtnDatecheck: React.FC<IBtnDatecheck> = ({
  text,
  day,
  thisMonth,
  selected,
  onClick,
}) => (
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
