import { useMutation } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { cls } from '../../../../utils/common.utils';
import { RESERVATION_STATE_KOR } from '../../../../constants/constants';
import { EDIT_RESERVATION_DOCUMENT } from '../../../../graphql';
import { MenuButton } from '../../../../components';
import { XMark } from '../../../../svgs';
import {
  type EditReservationMutation,
  ReservationState,
} from '../../../../types/generated.types';
import type { ReservationInList } from '../../../../types/common.types';

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
          'flex h-5 cursor-pointer items-center justify-center rounded-md border-red-400 text-xs',
          reservation.state === ReservationState.Canceled
            ? 'bg-red-400 text-white'
            : 'bg-white text-red-400'
        )}
        onClick={() => editState(ReservationState.Canceled)}
      >
        <XMark />
        예약취소
      </MenuButton>
      <MenuButton
        hasBorder
        className={cls(
          'flex h-5 cursor-pointer items-center justify-center rounded-md border-red-400 text-xs',
          reservation.state === ReservationState.NoShow
            ? 'bg-red-400 text-white'
            : 'bg-white text-red-400'
        )}
        onClick={() => editState(ReservationState.NoShow)}
      >
        <FontAwesomeIcon icon={faExclamation} fontSize={16} />
        예약부도
      </MenuButton>
    </>
  );
};

export default ToggleReservationState;
