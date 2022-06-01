interface BtnDotProps {
  onClick: any;
  label?: string;
  icon?: React.ReactNode;
  enabled?: boolean;
  isWidthFull?: boolean;
}

export const BtnMenu = ({
  onClick,
  label,
  icon,
  enabled,
  isWidthFull,
}: BtnDotProps) => (
  <button
    type="button"
    className={`btn-menu flex items-center gap-1 whitespace-nowrap ${
      enabled ? "font-semibold" : "opacity-70"
    } ${isWidthFull ? "w-full" : ""}`}
    onClick={onClick}
  >
    {icon} {label}
  </button>
);
