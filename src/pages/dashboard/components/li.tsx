interface DashboardLiProps {
  textContents: string;
  borderTop?: boolean;
  borderRight?: boolean;
  borderBottom?: boolean;
  textCenter?: boolean;
}
export const DashboardLi = ({
  textContents,
  borderTop,
  borderRight,
  borderBottom,
  textCenter,
}: DashboardLiProps) => {
  return (
    <li
      className={`group relative flex
       flex-col items-center gap-1 border-black px-4 py-1${
         borderTop ? " border-t" : ""
       }${borderRight ? " border-r" : ""}${borderBottom ? " border-b" : ""}`}
    >
      <span
        className={`w-full whitespace-nowrap${
          textCenter ? " text-center" : " text-right"
        }`}
      >
        {textContents}
      </span>
    </li>
  );
};
