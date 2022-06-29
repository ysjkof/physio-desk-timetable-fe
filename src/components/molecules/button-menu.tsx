import { ReactNode } from "react";
import { cls } from "../../libs/utils";

interface BtnDotProps {
  onClick?: any;
  label?: string;
  icon?: ReactNode;
  enabled?: boolean;
  isWidthFull?: boolean;
  hasBorder?: boolean;
  hasActiveRing?: boolean;
  hasFocus?: boolean;
  thinFont?: boolean;
  type?: "button" | "reset" | "submit";
  isCenter?: boolean;
}

export const BtnMenu = ({
  onClick,
  label,
  icon,
  enabled,
  isWidthFull,
  hasBorder,
  hasActiveRing,
  hasFocus,
  thinFont,
  type = "button",
  isCenter,
}: BtnDotProps) => (
  <button
    type={type}
    className={cls(
      "btn-menu flex items-center gap-1 whitespace-nowrap",
      hasBorder ? "border-gray-300" : "",
      enabled
        ? hasActiveRing
          ? " emphasize-ring border-transparent font-semibold"
          : " font-semibold"
        : " opacity-50",
      isWidthFull ? " w-full" : "",
      thinFont ? " py-0 text-[0.7rem] font-normal" : "",
      isCenter ? " mx-auto text-center" : "",
      onClick ? "" : " cursor-default hover:bg-inherit",
      hasFocus ? " focus:emphasize-ring" : "",
      label === "부도" && enabled
        ? "text-black"
        : label === "취소" && enabled
        ? "text-red-400"
        : ""
    )}
    onClick={onClick}
  >
    {icon} {label}
  </button>
);
