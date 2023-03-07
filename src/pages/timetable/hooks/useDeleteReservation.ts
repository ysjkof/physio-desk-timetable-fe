import { useMutation } from '@apollo/client';
import { DELETE_RESERVATION_DOCUMENT } from '../../../graphql';
import { setAlert, setConfirm } from '../../../store';
import type { DeleteReservationMutation } from '../../../types/generatedTypes';
import { getStringOfDateTime } from '../../../utils/dateUtils';

interface DeleteReservation {
  id: number;
  patientName?: string;
  startDate?: Date;
  closeAction?: () => void;
}

export const useDeleteReservation = () => {
  const [deleteReservationMutation] = useMutation<DeleteReservationMutation>(
    DELETE_RESERVATION_DOCUMENT
  );

  const deleteReservation = ({
    id,
    patientName,
    startDate,
    closeAction,
  }: DeleteReservation) => {
    let targetName = '';
    if (patientName && startDate) {
      targetName = `"${patientName}"님의 \ ${getStringOfDateTime(
        new Date(startDate)
      )} 예약`;
    }

    const confirmAction = () => {
      deleteReservationMutation({
        variables: { input: { reservationId: id } },
        onCompleted(data) {
          const {
            deleteReservation: { error },
          } = data;

          if (error) return setAlert({ messages: [`오류: ${error}`] });

          closeAction?.();
        },
      });
    };

    setConfirm({
      buttonText: '지우기',
      messages: ['선택한 예약을 지웁니다'],
      targetName,
      confirmAction,
    });
  };

  return { deleteReservation };
};
