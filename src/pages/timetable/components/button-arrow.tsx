import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cls } from "../../../libs/utils";

interface IBtnArrow {
  direction: "prev" | "after";
  onClick?: any;
}

// FC = Functional Component
export const BtnArrow: React.FC<IBtnArrow> = ({ direction, onClick }) => (
  <button className={cls("btn-sm btn-border")} onClick={onClick}>
    {direction === "prev" ? (
      <FontAwesomeIcon icon={faArrowLeft} />
    ) : (
      <FontAwesomeIcon icon={faArrowRight} />
    )}
  </button>
);
