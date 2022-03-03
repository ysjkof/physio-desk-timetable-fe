import { useNavigate } from "react-router-dom";
import { cls, getHHMM, getTimeLength } from "../libs/utils";
import { ViewOption } from "../pages/time-table";
import { NameTag } from "./name-tag";

interface IScheduleBox {
  id: number;
  // gridRowStart: number;
  // gridRowEnd: number;
  hhmm: string;
  memo: string | null;
  startDate: Date;
  endDate: Date;
  state: "Canceled" | "NoShow" | "Reserved";
  gender: string;
  patientName: string;
  registrationNumber: string | null;
  birthday: Date;
  viewOption: ViewOption;
  shrink?: boolean;
  canClick?: boolean;
}

export const ScheduleBox: React.FC<IScheduleBox> = ({
  id,
  // gridRowStart,
  // gridRowEnd,
  hhmm,
  memo,
  startDate,
  endDate,
  state,
  gender,
  patientName,
  registrationNumber,
  birthday,
  viewOption,
  shrink = false,
  canClick,
}) => {
  const navigate = useNavigate();
  // onClick => 수정 || 삭제
  const timeLength = getTimeLength(startDate, endDate);
  const onClick = () => {
    console.log("you click ScheduleBox");
    navigate(`reservation/${id}`);
  };
  switch (state) {
    case "Canceled":
      if (!viewOption.seeCancel) return <></>;
      break;
    case "NoShow":
      if (!viewOption.seeNoshow) return <></>;
      break;
  }
  return (
    <>
      <div
        className={cls(
          "group relative col-start-2 mx-auto rounded-md border bg-white transition duration-200 hover:z-50 hover:cursor-pointer hover:border-transparent hover:ring-2 hover:ring-gray-900",
          shrink ? "w-[146px]" : "",
          state === "NoShow"
            ? "border-yellow-600 bg-yellow-200 opacity-40"
            : state === "Canceled"
            ? "border-red-600 bg-red-200 opacity-40"
            : ""
        )}
        // style={{
        //   gridRowStart,
        //   gridRowEnd,
        // }}
        id={hhmm}
        onClick={onClick}
      >
        <NameTag
          id={id}
          gender={gender}
          name={patientName}
          registrationNumber={registrationNumber}
          birthday={birthday}
          shrink={shrink}
        />
        <div
          className={cls(
            "overflow-hidden",
            timeLength === 20
              ? "h-[24px]"
              : timeLength === 30
              ? "h-[48px]"
              : timeLength === 40
              ? "h-[72px]"
              : timeLength === 50
              ? "h-[120px]"
              : timeLength === 60
              ? "h-[144px]"
              : timeLength === 70
              ? "h-[168px]"
              : timeLength === 80
              ? "h-[192px]"
              : timeLength === 90
              ? "h-[216px]"
              : ""
          )}
        >
          <span className="block text-sm text-gray-600">
            {memo
              ? timeLength === 20
                ? memo.substring(0, 10) + " ..."
                : timeLength === 30
                ? memo.substring(0, 22) + " ..."
                : timeLength === 40
                ? memo.substring(0, 33) + " ..."
                : timeLength === 50
                ? memo.substring(0, 71) + " ..."
                : timeLength === 60
                ? memo.substring(0, 83) + " ..."
                : timeLength === 70
                ? memo.substring(0, 9) + " ..."
                : timeLength === 80
                ? memo.substring(0, 111) + " ..."
                : timeLength === 90
                ? memo.substring(0, 133) + " ..."
                : ""
              : ""}
          </span>
        </div>
        <div className="absolute -top-6 right-1/2 hidden translate-x-1/2 rounded-lg border bg-white px-4 text-gray-500 shadow group-hover:block group-hover:ring-2 group-hover:ring-gray-900">
          {getHHMM(startDate)}~{getHHMM(endDate)}
        </div>
      </div>
    </>
  );
};
