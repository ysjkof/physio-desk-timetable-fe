interface BtnDotProps {
  onClick: any;
  label?: string;
  icon?: React.ReactNode;
  enabled?: boolean;
  isWidthFull?: boolean;
  hasBorder?: boolean;
  hasActiveRing?: boolean;
  thinFont?: boolean;
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
}: BtnDotProps) => (
  <button
    type="button"
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
    }`}
    onClick={onClick}
  >
    {icon} {label}
  </button>
);
