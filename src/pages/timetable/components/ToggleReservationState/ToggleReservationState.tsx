import { useMutation } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCommentSlash } from '@fortawesome/free-solid-svg-icons';
import { cls } from '../../../../utils/common.utils';
import { RESERVATION_STATE_KOR } from '../../../../constants/constants';
import { EDIT_RESERVATION_DOCUMENT } from '../../../../graphql';
import type { ReservationInList } from '../../../../types/common.types';
import {
  type EditReservationMutation,
  ReservationState,
} from '../../../../types/generated.types';
import { MenuButton } from '../../../../components';

interface EditReservationStateProps {
  reservation: ReservationInList;
}

const ToggleReservationState = ({ reservation }: EditReservationStateProps) => {
  const [editReservationMutation] = useMutation<EditReservationMutation>(
    EDIT_RESERVATION_DOCUMENT
  );

  const editState = (state: ReservationState) => {
    if (reservation.state === state) return changeToReserved(reservation.id);

    const ok = window.confirm(
      `예약 상태를 ${RESERVATION_STATE_KOR[state]}(으)로 변경합니다.`
    );
    if (!ok) return;
    editReservationMutation({
      variables: {
        input: {
          reservationId: reservation.id,
          state,
        },
      },
    });
  };

  const changeToReserved = (reservationId: number) => {
    const ok = window.confirm(
      `예약 상태를 ${RESERVATION_STATE_KOR.Reserved}(으)로 변경합니다.`
    );
    if (!ok) return;
    editReservationMutation({
      variables: {
        input: {
          reservationId,
          state: ReservationState.Reserved,
        },
      },
    });
  };

  return (
    <>
      <MenuButton
        hasBorder
        className={cls(
          'flex w-full cursor-pointer items-center justify-center gap-1 rounded-md py-2 text-sm hover:ring hover:ring-navy',
          reservation.state === ReservationState.Canceled
            ? 'border-navy text-navy'
            : 'text-gray-500'
        )}
        onClick={() => editState(ReservationState.Canceled)}
      >
        <FontAwesomeIcon icon={faBan} fontSize={14} />
        예약취소
      </MenuButton>
      <MenuButton
        hasBorder
        className={cls(
          'flex w-full cursor-pointer items-center justify-center gap-1 rounded-md py-2 text-sm hover:ring hover:ring-navy',
          reservation.state === ReservationState.NoShow
            ? 'border-navy text-navy'
            : 'text-gray-500'
        )}
        onClick={() => editState(ReservationState.NoShow)}
      >
        <FontAwesomeIcon icon={faCommentSlash} fontSize={14} />
        예약부도
      </MenuButton>
    </>
  );
};

export default ToggleReservationState;
