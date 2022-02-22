import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cls } from "../libs/utils";
import { NameTag } from "./name-tag";

interface IScheduleBox {
  id: number;
  // gridRowStart: number;
  // gridRowEnd: number;
  hhmm: string;
  memo: string | null;
  startDate: string;
  endDate: string;
  gender: string;
  patientName: string;
  registrationNumber: string | null;
  birthday: Date;
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
  gender,
  patientName,
  registrationNumber,
  birthday,
  shrink = false,
  canClick,
}) => {
  const navigate = useNavigate();
  const [activation, setActivation] = useState();
  const onClick = () => {
    console.log("you click ScheduleBox");
  };
  return (
    <div
      className={cls(
        "group relative col-start-2 rounded-lg border bg-white hover:cursor-pointer hover:border-transparent hover:ring-2 hover:ring-gray-900",
        shrink ? "w-[146px]" : ""
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
      <span className="block text-sm text-gray-600">{memo}</span>
      <div className="absolute right-4 -bottom-3 hidden rounded-lg border bg-white px-4 text-gray-500 group-hover:block">
        {startDate}~{endDate}
      </div>
    </div>
  );
};
