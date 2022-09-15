import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { TimetableModalProps } from '../..';
import { useDeleteReservationMutation } from '../../../../graphql/generated/graphql';
import { IListReservation } from '../../../../types/type';
import ReserveForm from './ReserveForm';
import ReservationCardDetail from './ReservationCardDetail';
import MenuButton from '../../../../components/molecules/MenuButton';

interface DayOffCardProps extends TimetableModalProps {
  reservation: IListReservation;
}

export default function DayOffCard({
  closeAction,
  reservation,
}: DayOffCardProps) {
  const [isEdit, setIsEdit] = useState(false);

  const [deleteReservationMutation] = useDeleteReservationMutation({});

  const onClickDelete = () => {
    const confirmDelete = window.confirm('예약을 지웁니다.');
    if (confirmDelete) {
      deleteReservationMutation({
        variables: { input: { reservationId: reservation.id } },
        onCompleted(data) {
          const {
            deleteReservation: { ok },
          } = data;
          if (ok) {
            closeAction();
          }
        },
      });
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-5 text-left font-medium"></h4>

      <div className="reservation-editor flex justify-around">
        <MenuButton
          icon={<FontAwesomeIcon icon={faTrashCan} fontSize={14} />}
          enabled
          label={'삭제'}
          onClick={onClickDelete}
        />
        <MenuButton
          icon={<FontAwesomeIcon icon={faEdit} fontSize={14} />}
          enabled={isEdit}
          label={'수정'}
          onClick={() => setIsEdit((prev) => !prev)}
        />
      </div>

      <div className="h-full overflow-y-scroll">
        {!isEdit && (
          <ReservationCardDetail reservation={reservation} hasEndDate />
        )}
        {isEdit && (
          <ReserveForm
            userId={reservation.user.id}
            closeAction={closeAction}
            reservation={reservation}
          />
        )}
      </div>
    </div>
  );
}
