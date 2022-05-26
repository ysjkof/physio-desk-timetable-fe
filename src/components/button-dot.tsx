import { cls } from "../libs/utils";

interface BtnDotProps {
  enabled: boolean;
  label: string;
  onClick: any;
}

// FC = Functional Component
export const BtnDot = ({ enabled, label, onClick }: BtnDotProps) => (
  <button
    type="button"
    className={cls(
      "dot relative text-base tracking-widest hover:scale-110",
      enabled
        ? "font-semibold text-gray-700 after:bg-emerald-300"
        : "text-gray-400 after:bg-gray-400"
    )}
    onClick={onClick}
  >
    {label}
  </button>
);
