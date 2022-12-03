import { useMutation } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRotateLeft,
  faBan,
  faCommentSlash,
} from '@fortawesome/free-solid-svg-icons';
import { cls } from '../../../../utils/common.utils';
import { RESERVATION_STATE_KOR } from '../../../../constants/constants';
import { EDIT_RESERVATION_DOCUMENT } from '../../../../graphql';
import { ReservationInList } from '../../../../types/common.types';
import {
  EditReservationMutation,
  ReservationState,
} from '../../../../types/generated.types';

interface EditReservationStateProps {
  reservation: ReservationInList;
}

export default function EditReservationState({
  reservation,
}: EditReservationStateProps) {
  const [editReservationMutation] = useMutation<EditReservationMutation>(
    EDIT_RESERVATION_DOCUMENT
  );

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
}
