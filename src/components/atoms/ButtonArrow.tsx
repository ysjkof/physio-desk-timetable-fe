import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cls } from '../../utils/utils';
import { NEXT, PREV } from '../../constants/constants';

interface BtnArrowProps {
  direction: typeof PREV | typeof NEXT;
  onClick: any;
  className?: string;
}

export const BtnArrow = ({ direction, onClick, className }: BtnArrowProps) => (
  <button
    className={cls('btn-menu rounded-md border bg-white p-1', className ?? '')}
    onClick={onClick}
  >
    {direction === PREV ? (
      <FontAwesomeIcon icon={faArrowLeft} fontSize={14} />
    ) : (
      <FontAwesomeIcon icon={faArrowRight} fontSize={14} />
    )}
  </button>
);
