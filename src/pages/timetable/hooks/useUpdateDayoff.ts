import { useMutation } from '@apollo/client';
import { UPDATE_RESERVATION_DOCUMENT } from '../../../graphql';
import { setAlert } from '../../../store';
import type { UpdateReservationMutation } from '../../../types/generatedTypes';
import type { UpdateDayoffInput } from '../../../types/processedGeneratedTypes';

export const useUpdateDayoff = () => {
  const [editDayoffMutation, { loading }] =
    useMutation<UpdateReservationMutation>(UPDATE_RESERVATION_DOCUMENT);

  const updateDayoff = (
    input: UpdateDayoffInput,
    callbackAfterMutation?: () => void
  ) => {
    editDayoffMutation({
      variables: { input },
      onCompleted(data) {
        const { error } = data.updateReservation;
        if (error) {
          return setAlert({ messages: [`오류: ${error}`] });
        }

        setAlert({ messages: ['변경완료'] });
        callbackAfterMutation?.();
      },
    });
  };

  return { updateDayoff, loading };
};
