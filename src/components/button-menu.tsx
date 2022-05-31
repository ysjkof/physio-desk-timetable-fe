interface BtnDotProps {
  label?: string;
  onClick: any;
  enabled?: boolean;
  icon?: React.ReactNode;
}

export const BtnMenu = ({
  enabled = true,
  label,
  onClick,
  icon,
}: BtnDotProps) => (
  <button
    type="button"
    className={`btn-menu flex items-center gap-1 ${
      enabled ? "font-semibold" : "opacity-50"
    }`}
    onClick={onClick}
  >
    {icon} {label}
  </button>
);
