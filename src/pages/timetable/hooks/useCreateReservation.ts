import { useMutation } from '@apollo/client';
import { simpleCheckGQLError } from '../../../utils/apolloUtils';
import { CREATE_RESERVATION_DOCUMENT } from '../../../graphql';
import type {
  CreateReservationInput,
  CreateReservationMutation,
} from '../../../types/generatedTypes';

export const useCreateReservation = () => {
  const [createReservationMutation, { loading }] =
    useMutation<CreateReservationMutation>(CREATE_RESERVATION_DOCUMENT);

  const createReservation = (input: CreateReservationInput) => {
    createReservationMutation({
      variables: { input },
      onCompleted(data) {
        const { ok, error } = data.createReservation;
        simpleCheckGQLError(ok, error);
      },
    });
  };

  return { createReservation, loading };
};
