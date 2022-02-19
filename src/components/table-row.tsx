import { useNavigate } from "react-router-dom";
import { cls, getHHMM, getYMD } from "../libs/utils";

interface ITableRowProps {
  date: Date;
  labelDate: Date;
  selected: boolean;
  gridRowStart?: number;
  gridColumnStart?: number;
  shrink?: boolean;
}

export const TableRow: React.FC<ITableRowProps> = ({
  selected,
  date,
  labelDate,
  gridRowStart,
  gridColumnStart,
  children,
  shrink,
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
        "flex h-[24px] select-none border-dashed border-gray-400 text-center text-sm text-gray-500",
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
          "relative -top-2.5 mx-1 block min-h-[20px] min-w-[40px] rounded-full bg-white",
          selected ? "block" : "hidden"
        )}
      >
        {labelDate.getMinutes() === 0 || labelDate.getMinutes() === 30
          ? getHHMM(labelDate, ":")
          : null}
      </span>

      <div className="w-full min-w-[150px] px-1">
        {children?.toString() ? (
          <div>{children}</div>
        ) : (
          <div
            className="group flex h-full w-full items-center hover:cursor-pointer hover:rounded-lg hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-500 hover:shadow"
            onClick={onClick}
          >
            <span className="mx-auto hidden whitespace-nowrap text-sm font-medium text-white group-hover:block">
              {shrink
                ? labelDate.toLocaleString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : labelDate.toLocaleString("ko-KR", {
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
    </div>
  );
};
