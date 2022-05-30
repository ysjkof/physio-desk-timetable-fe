import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cls } from "../../../libs/utils";

interface ButtonCheckProps {
  name: string;
  isActivated: boolean;
  isMemberActivated?: boolean;
  onClickFx: () => void;
}

export const ButtonCheck: React.FC<ButtonCheckProps> = ({
  name,
  isActivated,
  isMemberActivated,
  onClickFx,
}) => (
  <li
    className={cls(
      isActivated ? "" : "",
      "mb-2 flex items-center justify-between"
    )}
  >
    <div className="w-full overflow-hidden">
      <span className="ml-5 whitespace-nowrap">{name}</span>
    </div>
    <div className="flex w-14 justify-center">
      {typeof isMemberActivated === "undefined" && (
        <FontAwesomeIcon
          icon={faCheckCircle}
          fontSize="large"
          className={cls(isActivated ? "text-green-500" : "")}
          onClick={() => onClickFx()}
        />
      )}
      {typeof isMemberActivated !== "undefined" && (
        <FontAwesomeIcon
          icon={faCheckCircle}
          fontSize="large"
          className={cls(
            isActivated ? (isMemberActivated ? "text-green-500" : "") : ""
          )}
          onClick={() => onClickFx()}
        />
      )}
    </div>
  </li>
);
