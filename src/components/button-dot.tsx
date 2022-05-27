import { cls } from "../libs/utils";

interface BtnDotProps {
  enabled: boolean;
  label: string;
  onClick: any;
}

export const BtnDot = ({ enabled, label, onClick }: BtnDotProps) => (
  <button
    type="button"
    className={cls(
      "relative text-base tracking-widest hover:scale-110",
      enabled
        ? "dot font-semibold text-gray-700 after:bg-emerald-300"
        : "text-gray-400"
    )}
    onClick={onClick}
  >
    {label}
  </button>
);
