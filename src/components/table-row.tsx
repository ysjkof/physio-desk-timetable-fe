import { useNavigate } from "react-router-dom";
import { cls, getHHMM, getYMD } from "../libs/utils";

interface ITableRowProps {
  date: Date;
  labelDate: Date;
  label: boolean;
  gridRowStart?: number;
  gridColumnStart?: number;
}

export const TableRow: React.FC<ITableRowProps> = ({
  label,
  date,
  labelDate,
  gridRowStart,
  gridColumnStart,
  children,
}) => {
  const navigate = useNavigate();
  const onClick = () => {
    const startDate = new Date(date);
    startDate.setHours(labelDate.getHours());
    startDate.setMinutes(labelDate.getMinutes());
    startDate.setSeconds(0);
    navigate("reserve", {
      state: { todo: "reserve", startDate },
    });
  };
  return (
    <div
      className={cls(
        label
          ? "col-start-1 text-center text-sm text-gray-500 select-none border-x border-gray-400 "
          : "col-start-2 border-t border-dashed text-center text-sm cursor-pointer group border-r border-gray-300"
      )}
      style={{ gridRowStart, gridColumnStart }}
      id={
        label
          ? "label" + getYMD(date, "yymmdd") + getHHMM(labelDate)
          : "empty" + getYMD(date, "yymmdd") + getHHMM(labelDate)
      }
    >
      {label ? (
        <span className="relative -top-2.5 block min-h-[20px]">
          {date.getMinutes() === 0 || date.getMinutes() === 30
            ? getHHMM(date, ":")
            : null}
        </span>
      ) : children?.toString() ? (
        <div className="block min-h-[20px]">
          <div>{children}</div>
        </div>
      ) : (
        <div
          className="block min-h-[20px] group-hover:shadow group-hover:rounded-lg hover:bg-zinc-2000 mx-2 group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:to-indigo-500 h-full"
          onClick={label ? undefined : onClick}
        >
          <span className="mx-auto w-fit hidden group-hover:block text-sm font-medium text-white">
            {labelDate.toLocaleString("ko-KR", {
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            예약하기
          </span>
        </div>
      )}
    </div>
  );
};
