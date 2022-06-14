interface DashboardLiProps {
  textContents: string;
  isTotalSum?: boolean;
}
export const DashboardLi = ({ textContents, isTotalSum }: DashboardLiProps) => {
  return (
    <li
      className={`group relative flex flex-col items-center gap-1 py-1${
        isTotalSum ? " border-t border-black px-4" : ""
      }`}
    >
      <span className="w-full whitespace-nowrap text-right">
        {textContents}
      </span>
    </li>
  );
};
