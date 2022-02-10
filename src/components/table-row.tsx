import { useNavigate } from "react-router-dom";
import { cls, getHHMM, getYMD } from "../libs/utils";

interface ITableRowProps {
  date: Date;
  hhmm: string;
  label: boolean;
  gridRowStart?: string;
}

export default function TableRow({
  label,
  date,
  hhmm,
  gridRowStart,
}: ITableRowProps) {
  const navigate = useNavigate();
  const onClick = () => {
    navigate("reserve", { state: { todo: "reserve", startDate: date } });
  };
  return (
    <div
      className={cls(
        label
          ? "relative col-start-1 text-center text-sm text-gray-500 select-none"
          : "col-start-2 border-t border-dashed text-center text-sm cursor-pointer group"
      )}
      style={{ gridRowStart }}
      id={
        label
          ? "label" + getYMD(date, "yymmdd") + hhmm
          : "empty" + getYMD(date, "yymmdd") + hhmm
      }
      onClick={label ? undefined : onClick}
    >
      {label ? (
        <span className="relative -top-2.5 block min-h-[20px]">
          {date.getMinutes() === 0 || date.getMinutes() === 30
            ? getHHMM(date, ":")
            : null}
        </span>
      ) : (
        <div className="block min-h-[20px] group-hover:shadow group-hover:rounded-lg hover:bg-zinc-2000 mx-6 group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:to-indigo-500">
          <span className="mx-auto w-fit hidden group-hover:block text-sm font-medium text-white">
            {date.toLocaleString("ko-KR", {
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            예약하기
          </span>
        </div>
      )}
    </div>
  );
}
