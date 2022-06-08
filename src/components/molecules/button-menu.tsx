import { ReactNode } from "react";

interface BtnDotProps {
  onClick: any;
  label?: string;
  icon?: ReactNode;
  enabled?: boolean;
  isWidthFull?: boolean;
  hasBorder?: boolean;
  hasActiveRing?: boolean;
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
  thinFont,
  type = "button",
  isCenter,
}: BtnDotProps) => (
  <button
    type={type}
    className={`btn-menu flex items-center gap-1 whitespace-nowrap${
      hasBorder ? " border" : ""
    }${
      enabled
        ? hasActiveRing
          ? " emphasize-ring border-transparent font-semibold"
          : " font-semibold"
        : " opacity-50"
    }${isWidthFull ? " w-full" : ""}${
      thinFont ? " py-0 text-[0.25rem] font-normal" : ""
    }${isCenter ? " mx-auto" : ""}`}
    onClick={onClick}
  >
    {icon} {label}
  </button>
);
