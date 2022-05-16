import { faFemale, faMale } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CreatePatientInput } from "../graphql/generated/graphql";
import { getYMD } from "../libs/timetable-utils";
import { cls } from "../libs/utils";
import { selectedPatientVar } from "../store";

export interface INameTagProps
  extends Pick<
    CreatePatientInput,
    "name" | "gender" | "registrationNumber" | "birthday"
  > {
  id: number;
  groupName: string;
  canClick?: boolean;
  shrink?: boolean;
  therapist?: { id: number; name: string };
}

export const NameTag = ({
  id,
  gender,
  name,
  registrationNumber,
  birthday,
  groupName,
  canClick = false,
  shrink = false,
  therapist,
}: INameTagProps) => {
  const onClick = () =>
    selectedPatientVar({
      id,
      gender,
      name,
      registrationNumber,
      birthday,
      groupName,
      therapist,
    });
  return (
    <div onClick={canClick ? onClick : undefined}>
      <div
        className={cls(
          "flex cursor-pointer items-baseline justify-between  px-1",
          shrink ? "h-[20px] w-[140px]" : "",
          canClick ? "" : "pointer-events-none"
        )}
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
            {name!.length > 8 ? `${name!.substring(0, 8)}...` : name}
          </span>
        </div>
        {/* 하루 보기와 1주 보기에서 조건이 좀 다양함. 수정할 것. */}
        {name!.length > 8 ? (
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
      {groupName && <span className="px-6 text-sm">{groupName}</span>}
      {/* 마지막 치료한 치료사 */}

      <span>{therapist?.name}</span>
    </div>
  );
};
