import { useMutation } from '@apollo/client';
import { DELETE_RESERVATION_DOCUMENT } from '../../../graphql';
import { setAlert } from '../../../store';
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
    deleteReservationMutation({
      variables: { input: { reservationId } },
      onCompleted(data) {
        const {
          deleteReservation: { error },
        } = data;

        if (error) return setAlert({ messages: [`오류: ${error}`] });

        closeAction?.();
      },
    });
  };

  return { deleteReservation };
};
