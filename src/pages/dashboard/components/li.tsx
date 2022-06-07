interface DashboardLiProps {
  name?: string;
  price: number;
  count: number | undefined;
}
export const DashboardLi = ({ name, price, count }: DashboardLiProps) => {
  return (
    <li className="group relative grid grid-cols-[1fr_7.5rem_3.3rem] items-center gap-3">
      <span className="">{name}</span>
      <span className="text-right">{price.toLocaleString()}원</span>
      <span className="text-right">{count ?? 0}번</span>
    </li>
  );
};