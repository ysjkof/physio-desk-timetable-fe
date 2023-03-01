import { useMutation } from '@apollo/client';
import { EDIT_RESERVATION_DOCUMENT } from '../../../graphql';
import { setAlert } from '../../../store';
import type { EditReservationMutation } from '../../../types/generatedTypes';
import type { EditDayoffInput } from '../../../types/processedGeneratedTypes';

export const useEditDayoff = () => {
  const [editDayoffMutation, { loading }] =
    useMutation<EditReservationMutation>(EDIT_RESERVATION_DOCUMENT);

  const editDayoff = (
    input: EditDayoffInput,
    callbackAfterMutation?: () => void
  ) => {
    editDayoffMutation({
      variables: { input },
      onCompleted(data) {
        const { error } = data.editReservation;
        if (error) {
          return setAlert({ messages: [`오류: ${error}`] });
        }

        setAlert({ messages: ['변경완료'] });
        callbackAfterMutation?.();
      },
    });
  };

  return { editDayoff, loading };
};
