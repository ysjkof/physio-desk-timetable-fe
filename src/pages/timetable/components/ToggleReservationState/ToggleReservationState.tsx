import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { cls } from '../../../../utils/commonUtils';
import { Check, XMark } from '../../../../svgs';
import { ReservationState } from '../../../../types/generatedTypes';
import { useToggleReservationState } from '../../hooks';
import type { ReservationOfGetReservationsByInterval } from '../../../../types/processedGeneratedTypes';

interface EditReservationStateProps {
  reservation: ReservationOfGetReservationsByInterval;
}

const ToggleReservationState = ({ reservation }: EditReservationStateProps) => {
  const { editState } = useToggleReservationState(reservation);

  const isReserved = reservation.state === ReservationState.Reserved;
  const isCanceled = reservation.state === ReservationState.Canceled;
  const isNoShow = reservation.state === ReservationState.NoShow;

  const toggleReserved = () => editState(ReservationState.Reserved);
  const toggleCanceled = () => editState(ReservationState.Canceled);
  const toggleNoShow = () => editState(ReservationState.NoShow);

  return (
    <div className="flex w-full text-sm">
      <button
        className={cls(
          'flex w-full cursor-pointer items-center justify-center gap-x-2',
          isReserved ? 'font-medium' : 'border-gray-300 text-gray-300'
        )}
        onClick={toggleReserved}
      >
        <Check className="h-4 w-4" />
        예약
      </button>
      <button
        className={cls(
          'flex w-full cursor-pointer items-center justify-center gap-x-2',
          isCanceled ? 'cancel font-medium' : 'border-gray-300 text-gray-300'
        )}
        onClick={toggleCanceled}
      >
        <XMark className="h-5 w-5" />
        취소
      </button>
      <button
        className={cls(
          'flex w-full cursor-pointer items-center justify-center gap-x-2',
          isNoShow ? 'noshow font-medium' : 'border-gray-300 text-gray-300'
        )}
        onClick={toggleNoShow}
      >
        <FontAwesomeIcon icon={faExclamation} fontSize={14} />
        부도
      </button>
    </div>
  );
};

export default ToggleReservationState;
