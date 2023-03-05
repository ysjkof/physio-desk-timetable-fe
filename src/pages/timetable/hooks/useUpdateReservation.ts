import { useMutation } from '@apollo/client';
import { setAlert } from '../../../store';
import { UPDATE_RESERVATION_DOCUMENT } from '../../../graphql';
import type {
  UpdateReservationInput,
  UpdateReservationMutation,
  UpdateReservationMutationVariables,
} from '../../../types/generatedTypes';

export const useUpdateReservation = () => {
  const [editReservationMutation, { loading }] = useMutation<
    UpdateReservationMutation,
    UpdateReservationMutationVariables
  >(UPDATE_RESERVATION_DOCUMENT);

  const editReservation = (
    input: UpdateReservationInput,
    callbackAfterMutation?: () => void
  ) => {
    editReservationMutation({
      variables: { input },
      onCompleted(data) {
        const { error } = data.updateReservation;
        if (error) {
          return setAlert({ messages: [`오류: ${error}`] });
        }

        setAlert({ messages: ['변경완료'], isPositive: true });
        callbackAfterMutation?.();
      },
    });
  };

  return { editReservation, loading };
};
