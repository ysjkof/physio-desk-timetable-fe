import { cls, getYMD } from "../libs/utils";

interface IName {
  id: number;
  gender: string;
  name: string;
  registrationNumber: string | null | undefined;
  birthday: Date;
  onClick?: any;
  columnCount?: 2 | 3 | 4;
}

export const Name: React.FC<IName> = ({
  id,
  gender,
  name,
  registrationNumber,
  birthday,
  onClick,
  columnCount = 4,
}) => {
  return (
    <div
      className={cls(
        "grid w-full grid-cols-5 items-center text-center text-gray-600",
        columnCount <= 3 ? "" : "py-2"
      )}
    >
      {columnCount === 2 && !registrationNumber ? (
        <span className="text-xs text-gray-400">
          {getYMD(birthday, "yymmdd", "-")}
        </span>
      ) : (
        <span
          className={cls(
            registrationNumber ? "text-right" : "text-center",
            " text-sm text-gray-400"
          )}
        >
          {registrationNumber ? registrationNumber : "-"}
        </span>
      )}
      <span
        className={cls(
          columnCount <= 3 ? "col-span-2 ml-5 flex" : "",
          columnCount === 2 ? "col-span-3 pl-1.5" : ""
        )}
      >
        {columnCount === 2 && name.length > 5
          ? `${name.substring(0, 4)}..`
          : name}
      </span>

      <div
        className={cls(
          "flex items-center",
          columnCount <= 3
            ? "col-span-2 flex-row justify-end space-x-2"
            : "flex-col",
          columnCount === 2 ? "col-span-1" : ""
        )}
      >
        <span
          className={cls(gender === "male" ? "text-blue-500" : "text-red-400")}
        >
          {gender === "male" ? "남성" : "여성"}
        </span>
        {columnCount === 2 ? (
          ""
        ) : (
          <span className="text-xs text-gray-400">
            {getYMD(birthday, "yymmdd", "-")}
          </span>
        )}
      </div>
      {columnCount <= 3 ? (
        ""
      ) : (
        <>
          <div onClick={onClick}>
            <button className="rounded-full bg-gray-50 px-3 font-medium text-gray-500">
              자세히
            </button>
          </div>
          <div className="">
            <button className="rounded-full bg-blue-50 px-3 font-medium text-blue-400">
              예약
            </button>
          </div>
        </>
      )}
    </div>
  );
};
