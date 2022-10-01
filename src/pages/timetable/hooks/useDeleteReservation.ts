import { useDeleteReservationMutation } from '../../../graphql/generated/graphql';
import { toastOrNavigation } from '../../../utils/utils';
interface DeleteReservation {
  reservationId: number;
  closeAction?: () => void;
}

export default function useDeleteReservation() {
  const [deleteReservationMutation] = useDeleteReservationMutation();

  const deleteReservation = ({
    reservationId,
    closeAction,
  }: DeleteReservation) => {
    const confirmDelete = window.confirm('예약을 지웁니다.');
    if (confirmDelete) {
      deleteReservationMutation({
        variables: { input: { reservationId } },
        onCompleted(data) {
          const {
            deleteReservation: { ok, error },
          } = data;

          toastOrNavigation(ok, error, closeAction);
        },
      });
    }
  };

  return { deleteReservation };
}
