interface BtnMenuToggleProps {
  enabled: boolean;
  label: [string, string];
  onClick: any;
}

export const BtnMenuToggle = ({
  enabled,
  label,
  onClick,
}: BtnMenuToggleProps) => (
  <button className="btn-menu rounded-md border" onClick={onClick}>
    <span className={`${enabled ? "font-semibold" : "opacity-50"}`}>
      {label[0]}
    </span>
    <span className={`${!enabled ? "font-semibold" : "opacity-50"}`}>
      {label[1]}
    </span>
  </button>
);
