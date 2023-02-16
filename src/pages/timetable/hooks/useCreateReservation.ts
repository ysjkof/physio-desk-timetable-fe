import { useMutation } from '@apollo/client';
import { CREATE_RESERVATION_DOCUMENT } from '../../../graphql';
import { setAlert } from '../../../store';
import type {
  CreateReservationInput,
  CreateReservationMutation,
} from '../../../types/generatedTypes';

export const useCreateReservation = () => {
  const [createReservationMutation, { loading }] =
    useMutation<CreateReservationMutation>(CREATE_RESERVATION_DOCUMENT);

  const createReservation = (
    input: CreateReservationInput,
    callbackAfterMutation?: () => void
  ) => {
    createReservationMutation({
      variables: { input },
      onCompleted(data) {
        const { ok, error } = data.createReservation;
        if (error) {
          return setAlert({ messages: [`오류가 발생했습니다; ${error}`] });
        }

        setAlert({ messages: ['예약완료'], isPositive: true });
        callbackAfterMutation?.();
      },
    });
  };

  return { createReservation, loading };
};
