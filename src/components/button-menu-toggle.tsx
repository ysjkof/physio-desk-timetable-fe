interface BtnMenuToggleProps {
  enabled: boolean;
  label: [string, string];
  width?: "full";
  onClick: any;
}

export const BtnMenuToggle = ({
  enabled,
  label,
  width,
  onClick,
}: BtnMenuToggleProps) => (
  <button
    className={`btn-menu rounded-md border ${
      width ? "w-full justify-around space-x-20" : "space-x-2"
    }`}
    onClick={onClick}
  >
    <span className={`${enabled ? "font-semibold" : "opacity-70"}`}>
      {label[0]}
    </span>
    <span className={`${!enabled ? "font-semibold" : "opacity-70"}`}>
      {label[1]}
    </span>
  </button>
);
