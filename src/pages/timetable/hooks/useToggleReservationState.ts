import { useMutation } from '@apollo/client';
import { UPDATE_RESERVATION_DOCUMENT } from '../../../graphql';
import {
  ReservationState,
  type UpdateReservationMutation,
  type UpdateReservationMutationVariables,
} from '../../../types/generatedTypes';
import type { ReservationOfGetReservationsByInterval } from '../../../types/processedGeneratedTypes';
import { RESERVATION_STATE_KOR } from '../../../constants/constants';
import { setAlert, setConfirm } from '../../../store';
import { cacheUpdateReservationState } from '../../../utils/apolloUtils';

export const useToggleReservationState = (
  reservation: ReservationOfGetReservationsByInterval
) => {
  const { state: currentState, id } = reservation;

  const [editReservationMutation] = useMutation<
    UpdateReservationMutation,
    UpdateReservationMutationVariables
  >(UPDATE_RESERVATION_DOCUMENT);

  const editState = (_state: ReservationState) => {
    if (
      currentState === ReservationState.Reserved &&
      _state === ReservationState.Reserved
    )
      return;

    const state = currentState === _state ? ReservationState.Reserved : _state;

    const isPositive = state === ReservationState.Reserved;

    const targetName = `${RESERVATION_STATE_KOR[currentState]} -> ${RESERVATION_STATE_KOR[state]}`;

    setConfirm({
      buttonText: '바꾸기',
      messages: ['예약 상태 바꾸기'],
      isPositive,
      targetName,
      confirmAction() {
        editReservationMutation({
          variables: {
            input: {
              reservationId: id,
              state,
            },
          },
          onCompleted(data) {
            const { error } = data.updateReservation;
            if (error) {
              return setAlert({
                messages: ['예약 상태 바꾸기에 실패했습니다'],
              });
            }

            cacheUpdateReservationState(id, state);
          },
        });
      },
    });
  };

  return { editState };
};
