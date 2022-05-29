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
    <span className={`${enabled ? "btn-menu-true" : "btn-menu-false"}`}>
      {label[0]}
    </span>
    <span className={`${!enabled ? "btn-menu-true" : "btn-menu-false"}`}>
      {label[1]}
    </span>
  </button>
);
