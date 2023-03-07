import { useMutation } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { cls } from '../../../../utils/commonUtils';
import { RESERVATION_STATE_KOR } from '../../../../constants/constants';
import { UPDATE_RESERVATION_DOCUMENT } from '../../../../graphql';
import { MenuButton } from '../../../../components';
import { XMark } from '../../../../svgs';
import { setConfirm } from '../../../../store';
import {
  ReservationState,
  type UpdateReservationMutation,
} from '../../../../types/generatedTypes';
import type { ReservationOfGetReservationsByInterval } from '../../../../types/processedGeneratedTypes';

interface EditReservationStateProps {
  reservation: ReservationOfGetReservationsByInterval;
}

const ToggleReservationState = ({ reservation }: EditReservationStateProps) => {
  const [editReservationMutation] = useMutation<UpdateReservationMutation>(
    UPDATE_RESERVATION_DOCUMENT
  );

  const editState = (_state: ReservationState) => {
    const state =
      reservation.state === _state ? ReservationState.Reserved : _state;

    const isPositive = state === ReservationState.Reserved;

    const targetName = `${RESERVATION_STATE_KOR[reservation.state]} -> ${
      RESERVATION_STATE_KOR[state]
    }`;

    setConfirm({
      buttonText: '바꾸기',
      messages: ['예약 상태 바꾸기'],
      isPositive,
      targetName,
      confirmAction() {
        editReservationMutation({
          variables: {
            input: {
              reservationId: reservation.id,
              state,
            },
          },
        });
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
