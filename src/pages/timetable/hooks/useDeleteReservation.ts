import { useMutation } from '@apollo/client';
import { simpleCheckGQLError } from '../../../utils/apolloUtils';
import { DELETE_RESERVATION_DOCUMENT } from '../../../graphql';
import type { DeleteReservationMutation } from '../../../types/generatedTypes';

interface DeleteReservation {
  reservationId: number;
  closeAction?: () => void;
}

export const useDeleteReservation = () => {
  const [deleteReservationMutation] = useMutation<DeleteReservationMutation>(
    DELETE_RESERVATION_DOCUMENT
  );

  const deleteReservation = ({
    reservationId,
    closeAction,
  }: DeleteReservation) => {
    const confirmDelete = confirm('예약을 지웁니다.');
    if (confirmDelete) {
      deleteReservationMutation({
        variables: { input: { reservationId } },
        onCompleted(data) {
          const {
            deleteReservation: { ok, error },
          } = data;
          simpleCheckGQLError(ok, error, closeAction);
        },
      });
    }
  };

  return { deleteReservation };
};
