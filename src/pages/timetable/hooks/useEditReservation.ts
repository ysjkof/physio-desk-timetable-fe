import { useMutation } from '@apollo/client';
import { setAlert } from '../../../store';
import { EDIT_RESERVATION_DOCUMENT } from '../../../graphql';
import type {
  EditReservationInput,
  EditReservationMutation,
  EditReservationMutationVariables,
} from '../../../types/generatedTypes';

export const useEditReservation = () => {
  const [editReservationMutation, { loading }] = useMutation<
    EditReservationMutation,
    EditReservationMutationVariables
  >(EDIT_RESERVATION_DOCUMENT);

  const editReservation = (
    input: EditReservationInput,
    callbackAfterMutation?: () => void
  ) => {
    editReservationMutation({
      variables: { input },
      onCompleted(data) {
        const { error } = data.editReservation;
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
