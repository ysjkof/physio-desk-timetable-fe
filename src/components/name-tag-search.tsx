import { makeVar, useReactiveVar } from "@apollo/client";
import { faFemale, faMale } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getYMD } from "../libs/utils";
import { selectedPatientVar } from "../pages/reserve";

interface INameTag {
  id: number;
  gender: string;
  name: string;
  registrationNumber: string | null;
  birthday: Date;
  canClick?: boolean;
}

export const NameTagSearch: React.FC<INameTag> = ({
  id,
  gender,
  name,
  registrationNumber,
  birthday,
  canClick,
}) => {
  const onClick = () =>
    selectedPatientVar({
      __typename: "Patient",
      id,
      gender,
      name,
      registrationNumber,
      birthday,
    });
  return (
    <div
      className={`group mb-4 flex cursor-pointer items-baseline justify-between px-4 hover:bg-slate-200 ${
        canClick ? "" : "pointer-events-none"
      }`}
      onClick={onClick}
    >
      <div className="flex items-baseline gap-2">
        <span>
          {gender === "male" ? (
            <FontAwesomeIcon
              icon={faMale}
              className=" text-blue-500 group-hover:text-white"
            />
          ) : (
            <FontAwesomeIcon
              icon={faFemale}
              className="text-pink-500 group-hover:text-white"
            />
          )}
        </span>
        <span className="dark:text-light-blue-100 font-medium text-gray-800">
          {name}
        </span>
      </div>
      <span className="dark:text-light-blue-100 text-xs text-gray-700">
        r.no : {registrationNumber ? registrationNumber : "미등록"}
      </span>
      <span className="dark:text-light-blue-100 text-xs text-gray-700">
        b : {birthday ? getYMD(birthday, "yymmdd") : "미등록"}
      </span>
      {/* {registrationNumber ? (
          <span className="dark:text-light-blue-100 text-xs text-blue-600">
            R : {registrationNumber}
          </span>
        ) : (
          <span className="dark:text-light-blue-100 text-xs text-blue-600">
            B : {getYMD(birthday, "yymmdd")}
          </span>
        )} */}
    </div>
  );
};
