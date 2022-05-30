import {
  faCaretDown,
  faCaretLeft,
  faQuestion,
  faRotateBack,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getYMD } from "../../../libs/timetable-utils";
import { cls } from "../../../libs/utils";

interface ReservationCardNameProps {
  gender: string;
  name: string;
  registrationNumber: string | null | undefined;
  birthday: Date;
}

export const ReservationCardName = ({
  gender,
  name,
  registrationNumber,
  birthday,
}: ReservationCardNameProps) => {
  return (
    <div className="relative grid w-full grid-cols-5 items-center text-center text-gray-600">
      <span
        className={cls(
          registrationNumber ? "text-right" : "text-center",
          "text-gray-400"
        )}
      >
        {registrationNumber ? registrationNumber : "-"}
      </span>

      <span className="col-span-2 ml-5 flex">{name}</span>

      <div className="col-span-2 flex flex-row items-center justify-end space-x-2 pr-4">
        <span
          className={cls(gender === "male" ? "text-blue-500" : "text-red-400")}
        >
          {gender === "male" ? "남성" : "여성"}
        </span>
        <span className="text-gray-400">{getYMD(birthday, "yymmdd", "-")}</span>
      </div>
    </div>
  );
};
