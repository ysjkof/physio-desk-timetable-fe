interface DashboardLiProps {
  name?: string;
  price?: number;
  sum: number;
  count: number | undefined;
  isTotalSum?: boolean;
}
export const DashboardLi = ({
  name,
  price,
  sum,
  count,
  isTotalSum,
}: DashboardLiProps) => {
  return (
    <li
      className={`group relative grid grid-cols-[1fr_6rem_3rem_6rem] items-center gap-3${
        isTotalSum ? " border-t border-black px-4" : ""
      }`}
    >
      <span className="">{isTotalSum ? "총합" : name}</span>
      <span className="text-right">
        {price && `${price.toLocaleString()}원`}
      </span>
      <span className="text-right">{count ?? 0}번</span>
      <span className="text-right">{sum.toLocaleString()}원</span>
    </li>
  );
};
