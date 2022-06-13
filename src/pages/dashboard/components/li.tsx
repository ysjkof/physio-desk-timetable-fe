interface DashboardLiProps {
  sum: number;
  count: number | undefined;
  isTotalSum?: boolean;
}
export const DashboardLi = ({ sum, count, isTotalSum }: DashboardLiProps) => {
  return (
    <li
      className={`group relative flex flex-col items-center gap-1 py-1${
        isTotalSum ? " border-t border-black px-4" : ""
      }`}
    >
      <span className="w-full text-right">{count ?? 0}번</span>
      <span className="w-full text-right">￦{sum.toLocaleString()}</span>
    </li>
  );
};
