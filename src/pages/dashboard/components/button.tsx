import { cls } from "../../../libs/utils";

interface DashboardBtnProps {
  actionText: string;
  isValid: boolean;
  loading: boolean;
}

export const DashboardBtn = ({
  actionText,
  isValid,
  loading,
}: DashboardBtnProps) => {
  return (
    <button
      className={cls(
        "mx-auto block rounded-md px-10 py-2 font-medium text-white transition-colors focus:outline-none",
        isValid
          ? "bg-sky-600 hover:bg-sky-700"
          : "pointer-events-none bg-gray-300 "
      )}
    >
      {loading ? "Loading..." : actionText}
    </button>
  );
};
