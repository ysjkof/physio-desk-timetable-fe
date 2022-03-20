import { faFemale, faMale } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cls, getYMD } from "../libs/utils";
import { selectedPatientVar } from "../libs/variables";

interface INameTag {
  id: number;
  gender: string;
  name: string;
  registrationNumber: string | null | undefined;
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
  canClick = false,
  shrink = false,
}) => {
  const onClick = () =>
    selectedPatientVar({
      id,
      gender,
      name,
      registrationNumber,
      birthday,
    });
  return (
    <div
      className={cls(
        "flex cursor-pointer items-baseline justify-between  px-1",
        shrink ? "h-[20px] w-[140px]" : "",
        canClick ? "" : "pointer-events-none"
      )}
      onClick={canClick ? onClick : undefined}
    >
      <div className="flex">
        <span className="mx-1">
          {gender === "male" ? (
            <FontAwesomeIcon icon={faMale} className="text-blue-500" />
          ) : (
            <FontAwesomeIcon icon={faFemale} className="text-pink-500" />
          )}
        </span>
        <span className="dark:text-light-blue-100 min-w-[56px] overflow-hidden whitespace-nowrap text-center font-medium text-gray-800">
          {name.length > 8 ? `${name.substring(0, 8)}...` : name}
        </span>
      </div>
      {/* 하루 보기와 1주 보기에서 조건이 좀 다양함. 수정할 것. */}
      {name.length > 8 ? (
        ""
      ) : shrink ? (
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
    </div>
  );
};
