import { useMutation } from '@apollo/client';
import { CREATE_RESERVATION_DOCUMENT } from '../../../graphql';
import { setAlert } from '../../../store';
import type { CreateReservationMutation } from '../../../types/generatedTypes';
import type { CreateDayoffInput } from '../../../types/processedGeneratedTypes';

export const useCreateDayoff = () => {
  const [createDayoffMutation, { loading }] =
    useMutation<CreateReservationMutation>(CREATE_RESERVATION_DOCUMENT);

  const createDayoff = (
    input: CreateDayoffInput,
    callbackAfterMutation?: () => void
  ) => {
    createDayoffMutation({
      variables: {
        input: { ...input, isDayoff: true },
      },
      onCompleted(data) {
        const { error } = data.createReservation;
        if (error) {
          return setAlert({ messages: [`오류: ${error}`] });
        }

        setAlert({ messages: ['변경완료'] });
        callbackAfterMutation?.();
      },
    });
  };

  return { createDayoff, loading };
};
