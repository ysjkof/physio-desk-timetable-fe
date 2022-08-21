import { RESERVATION_STATE_KOR } from '../../../constants/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRotateLeft,
  faBan,
  faCommentSlash,
} from '@fortawesome/free-solid-svg-icons';
import { cls } from '../../../utils/utils';
import {
  ReservationState,
  useEditReservationMutation,
} from '../../../graphql/generated/graphql';
import { IListReservation } from '../../../types/type';

interface EditReservationStateProps {
  reservation: IListReservation;
  redirect?: () => void;
}

export const EditReservationState = ({
  reservation,
}: EditReservationStateProps) => {
  const [editReservationMutation] = useEditReservationMutation();

  const onClickEditReserve = (state: ReservationState) => {
    const confirmDelete = window.confirm(
      `예약 상태를 ${RESERVATION_STATE_KOR[state]}(으)로 변경합니다.`
    );
    if (confirmDelete) {
      editReservationMutation({
        variables: {
          input: {
            reservationId: reservation.id,
            state,
          },
        },
      });
    }
  };

  return (
    <>
      <FontAwesomeIcon
        icon={faBan}
        fontSize={14}
        onClick={() => onClickEditReserve(ReservationState.Canceled)}
        className={cls(
          'hover:cancel cursor-pointer rounded-full hover:scale-125',
          reservation.state === ReservationState.Canceled
            ? 'cancel pointer-events-none'
            : 'text-gray-400'
        )}
      />
      <FontAwesomeIcon
        icon={faCommentSlash}
        fontSize={14}
        onClick={() => onClickEditReserve(ReservationState.NoShow)}
        className={cls(
          'hover:noshow cursor-pointer rounded-full hover:scale-125',
          reservation.state === ReservationState.NoShow
            ? 'noshow pointer-events-none'
            : 'text-gray-400'
        )}
      />
      <FontAwesomeIcon
        icon={faArrowRotateLeft}
        fontSize={14}
        onClick={() => onClickEditReserve(ReservationState.Reserved)}
        className={cls(
          'cursor-pointer rounded-full',
          reservation.state === ReservationState.Reserved
            ? 'pointer-events-none text-gray-400'
            : 'text-blue-800 hover:scale-125'
        )}
      />
    </>
  );
};
