import { faFemale, faMale } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cls, getYMD } from "../libs/utils";
import { selectedPatientVar } from "../libs/variables";

interface INameTag {
  id: number;
  gender: string;
  name: string;
  registrationNumber: string | null;
  birthday: Date;
  canClick?: boolean;
  shrink?: boolean;
}

export const NameTag: React.FC<INameTag> = ({
  id,
  gender,
  name,
  registrationNumber,
  birthday,
  canClick,
  shrink = false,
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
      className={cls(
        "flex cursor-pointer items-baseline justify-between px-4 w-full",
        canClick ? "" : "pointer-events-none"
      )}
      onClick={onClick}
    >
      <div className="flex items-baseline gap-2">
        <span>
          {gender === "male" ? (
            <FontAwesomeIcon icon={faMale} className=" text-blue-500" />
          ) : (
            <FontAwesomeIcon icon={faFemale} className="text-pink-500" />
          )}
        </span>
        <span className="dark:text-light-blue-100 font-medium text-gray-800">
          {name}
        </span>
      </div>
      {shrink ? (
        registrationNumber ? (
          <span className="dark:text-light-blue-100 text-xs text-gray-700">
            r.no : {registrationNumber}
          </span>
        ) : (
          <span className="dark:text-light-blue-100 text-xs text-gray-700">
            b : {getYMD(birthday, "yymmdd")}
          </span>
        )
      ) : (
        <>
          <span className="dark:text-light-blue-100 text-xs text-gray-700">
            r.no : {registrationNumber ? registrationNumber : "미등록"}
          </span>
          <span className="dark:text-light-blue-100 text-xs text-gray-700">
            b : {birthday ? getYMD(birthday, "yymmdd") : "미등록"}
          </span>
        </>
      )}
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
