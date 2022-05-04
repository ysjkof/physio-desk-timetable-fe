import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { cls } from "../libs/utils";
import { FocusGroup } from "../store";

interface ButtonCheckProps {
  groupName?: string;
  groupActivation: boolean;
  memberName?: string;
  memberActivation?: boolean;
  onClickFx: () => void;
  focusGroup?: FocusGroup | null;
  onClickFocusGroup?: () => void;
}

export const ButtonCheck: React.FC<ButtonCheckProps> = ({
  groupName,
  groupActivation,
  memberName,
  memberActivation,
  onClickFx,
  focusGroup,
  onClickFocusGroup,
}) => (
  <>
    {groupName ? (
      <li
        className={cls(
          groupActivation ? "" : "text-gray-400",
          "mb-2 flex items-center justify-between"
        )}
      >
        <div className="w-full">{groupName}</div>
        <div className="flex w-full justify-around">
          <FontAwesomeIcon
            icon={faCheckCircle}
            fontSize="large"
            className={cls(
              groupActivation ? "text-green-500" : "",
              "cursor-pointer"
            )}
            onClick={() => onClickFx()}
          />
          <FontAwesomeIcon
            icon={faCheckCircle}
            fontSize="large"
            className={cls(
              focusGroup?.name === groupName
                ? "text-green-500"
                : "text-gray-400",
              "cursor-pointer"
            )}
            onClick={() => onClickFocusGroup && onClickFocusGroup()}
          />
        </div>
      </li>
    ) : (
      <li
        className={cls(
          groupActivation ? "" : "text-gray-400",
          memberActivation ? "" : "text-gray-400",
          "mb-2 flex items-center justify-between"
        )}
      >
        <div className="w-full overflow-hidden">
          <span className="ml-5 whitespace-nowrap">- {memberName}</span>
        </div>
        <div className="flex w-full justify-around">
          <FontAwesomeIcon
            icon={faCheckCircle}
            fontSize="large"
            className={cls(
              "w-full",
              groupActivation ? (memberActivation ? "text-green-500" : "") : "",
              "cursor-pointer"
            )}
            onClick={() => onClickFx()}
          />
          <div className="w-full"></div>
        </div>
      </li>
    )}
  </>
);
