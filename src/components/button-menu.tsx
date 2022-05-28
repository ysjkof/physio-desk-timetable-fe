interface BtnDotProps {
  enabled: boolean;
  label: string;
  onClick: any;
  icon?: React.ReactNode;
}

export const BtnMenu = ({ enabled, label, onClick, icon }: BtnDotProps) => (
  <button
    type="button"
    className={`btn-menu ${enabled ? "btn-menu-true" : "btn-menu-false"}`}
    onClick={onClick}
  >
    {icon} {label}
  </button>
);
