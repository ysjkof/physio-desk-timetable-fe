import { useNavigate } from "react-router-dom";
import { cls, getHHMM, getYMD } from "../libs/utils";

interface ITableRowProps {
  date: Date;
  labelDate: Date;
  selected: boolean;
  gridRowStart?: number;
  gridColumnStart?: number;
}

export const TableRow: React.FC<ITableRowProps> = ({
  selected,
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
        "group flex select-none border-dashed border-gray-400 text-center text-sm text-gray-500",
        selected ? "" : "",
        labelDate.getMinutes() === 0 || labelDate.getMinutes() === 30
          ? "border-t"
          : ""
      )}
      style={{ gridRowStart, gridColumnStart }}
      id={"label" + getYMD(date, "yymmdd") + getHHMM(labelDate)}
    >
      <span
        className={cls(
          "relative  -top-2.5 block min-h-[20px] min-w-[40px] bg-white px-1",
          selected ? "block" : "hidden"
        )}
      >
        {labelDate.getMinutes() === 0 || labelDate.getMinutes() === 30
          ? getHHMM(labelDate, ":")
          : null}
      </span>

      {children?.toString() ? (
        <div className="block min-h-[25px] w-full">
          <div>{children}</div>
        </div>
      ) : (
        <div
          className="hover:bg-zinc-2000 mx-2 block h-full min-h-[25px] w-full group-hover:rounded-lg group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:to-indigo-500 group-hover:shadow"
          onClick={onClick}
        >
          <span className="mx-auto hidden w-fit text-sm font-medium text-white group-hover:block">
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
