import { getTimeLength } from '../../services/dateServices';
import { RESERVATION_STATE_KOR } from '../../constants/constants';
import { EditReservationState } from './EditReservationState';
import { ReservationState } from '../../graphql/generated/graphql';
import { IListReservation } from '../../types/type';

interface ReservationCardDetailProps {
  reservation: IListReservation;
}

export const ReservationCardDetail = ({
  reservation,
}: ReservationCardDetailProps) => {
  const isDayOff = reservation.state === ReservationState.DayOff;

  return (
    <div className="flex flex-col gap-6">
      <div className="relative grid grid-cols-[5rem,1fr] items-center">
        <span>담당 치료사</span>
        <span>{reservation.user.name}</span>
      </div>

      <div className="grid grid-cols-[5rem,1fr] items-center">
        <span>시간</span>
        <span>{new Date(reservation.startDate).toLocaleString()}</span>
        <span className="col-start-2">
          {getTimeLength(reservation.startDate, reservation.endDate, 'minute')}
          분
        </span>
      </div>

      {!isDayOff && (
        <>
          <div className="grid grid-cols-[5rem,1fr] items-center">
            <span className="">처방</span>
            <span className="space-x-4">
              {reservation.prescriptions?.map((prescription, i) => (
                <span key={i}>{prescription.name}</span>
              ))}
            </span>
          </div>

          <div className="grid grid-cols-[5rem,1fr] items-center">
            <span className="">상태</span>
            <span className="flex justify-between pr-1">
              {RESERVATION_STATE_KOR[reservation.state]}
              <div className="space-x-4">
                <EditReservationState reservation={reservation} />
              </div>
            </span>
          </div>
        </>
      )}

      <div className="grid grid-cols-[5rem,1fr] items-center">
        <span className="">마지막 수정</span>
        <span>{reservation.lastModifier.name}</span>

        <span className="col-start-2">
          {new Date(reservation.lastModifier.updatedAt).toLocaleString()}
        </span>
      </div>

      <div>
        <span className="">메모</span>
        <p className="pl-4">{reservation.memo}</p>
      </div>
    </div>
  );
};
