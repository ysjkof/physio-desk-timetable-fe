import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NEXT, PREV } from "../../../variables";

interface BtnArrowProps {
  direction: typeof PREV | typeof NEXT;
  onClick: any;
}

export const BtnArrow = ({ direction, onClick }: BtnArrowProps) => (
  <button className="btn-menu rounded-md border bg-white p-1" onClick={onClick}>
    {direction === PREV ? (
      <FontAwesomeIcon icon={faArrowLeft} fontSize={20} />
    ) : (
      <FontAwesomeIcon icon={faArrowRight} fontSize={20} />
    )}
  </button>
);
