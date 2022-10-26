import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { TimetableModalProps } from '../../Timetable';
import { IListReservation } from '../../../../types/common.types';
import MenuButton from '../../../../components/molecules/MenuButton';
import useDeleteReservation from '../../hooks/useDeleteReservation';
import DayOffForm from './DayOffForm';
import CardDetail from './CardDetail';
import { getTimeLength } from '../../../../services/dateServices';

interface DayOffCardProps extends TimetableModalProps {
  reservation: IListReservation;
}

export default function DayOffCard({
  closeAction,
  reservation,
}: DayOffCardProps) {
  const [isEdit, setIsEdit] = useState(false);
  const { id, user, startDate, endDate, lastModifier, memo } = reservation;

  const { deleteReservation } = useDeleteReservation();
  const invokeDelete = () => {
    deleteReservation({ reservationId: id, closeAction });
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-5 text-left font-medium"></h4>

      <div className="reservation-editor flex justify-around">
        <MenuButton enabled onClick={invokeDelete}>
          <FontAwesomeIcon icon={faTrashCan} fontSize={14} />
          삭제
        </MenuButton>
        <MenuButton enabled={isEdit} onClick={() => setIsEdit((prev) => !prev)}>
          <FontAwesomeIcon icon={faEdit} fontSize={14} />
          수정
        </MenuButton>
      </div>

      <div className="h-full overflow-y-scroll">
        {isEdit ? (
          <DayOffForm
            userId={user.id}
            reservation={reservation}
            closeAction={closeAction}
          />
        ) : (
          <CardDetail>
            <CardDetail.Therapist>{user.name}</CardDetail.Therapist>
            <CardDetail.Time
              startTime={new Date(startDate).toLocaleString()}
              endTime={new Date(endDate).toLocaleString()}
              totalTime={getTimeLength(startDate, endDate, 'minute')}
            />
            <CardDetail.LastUpdate
              name={lastModifier.name}
              updatedAt={new Date(lastModifier.updatedAt).toLocaleString()}
            />
            <CardDetail.Memo>{memo}</CardDetail.Memo>
          </CardDetail>
        )}
      </div>
    </div>
  );
}
