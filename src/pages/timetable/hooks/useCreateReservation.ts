import { useMutation } from '@apollo/client';
import { simpleCheckGQLError } from '../../../utils/apollo.utils';
import { CREATE_RESERVATION_DOCUMENT } from '../../../graphql';
import type {
  CreateReservationInput,
  CreateReservationMutation,
} from '../../../types/generated.types';

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
