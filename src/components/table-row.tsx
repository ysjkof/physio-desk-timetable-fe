import { cls, getHHMM, getYMD } from "../libs/utils";

interface ITableRowProps {
  date: Date;
  hhmm: string;
  label?: boolean;
  gridRowStart?: string;
}

export default function TableRow({
  label = false,
  date,
  hhmm,
  gridRowStart,
}: ITableRowProps) {
  return (
    <div
      className={cls(
        label
          ? "relative col-start-1 text-center text-sm text-gray-500"
          : "col-start-2 border-t border-dashed text-center text-sm"
      )}
      style={{ gridRowStart }}
      id={
        label
          ? "label" + getYMD(date, "yymmdd") + hhmm
          : "empty" + getYMD(date, "yymmdd") + hhmm
      }
    >
      {label ? (
        <span className="relative -top-2.5 block min-h-[20px]">
          {date.getMinutes() === 0 || date.getMinutes() === 30
            ? getHHMM(date, ":")
            : ""}
        </span>
      ) : (
        <span className="block min-h-[20px]" />
      )}
    </div>
  );
}
