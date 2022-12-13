import { getTimeLength } from '../../../../utils/date.utils';
import { RESERVATION_STATE_KOR } from '../../../../constants/constants';
import { ReservationInList } from '../../../../types/common.types';
import ToggleReservationState from '../../components/ToggleReservationState/ToggleReservationState';
import CardDetail from './CardDetail';

interface ReservationCardDetailProps {
  reservation: ReservationInList;
}

export default function ReservationCardDetail({
  reservation,
}: ReservationCardDetailProps) {
  const { user, startDate, endDate, prescriptions, state, lastModifier, memo } =
    reservation;

  return (
    <CardDetail>
      <CardDetail.Therapist>{user.name}</CardDetail.Therapist>
      <CardDetail.Time
        startTime={new Date(startDate).toLocaleString()}
        endTime={new Date(endDate).toLocaleString()}
        totalTime={getTimeLength(startDate, endDate, 'minute')}
      />
      <CardDetail.Prescription>
        {prescriptions?.map((prescription, i) => (
          <span key={i}>{prescription.name}</span>
        ))}
      </CardDetail.Prescription>
      <CardDetail.State>
        {RESERVATION_STATE_KOR[state]}
        <div className="space-x-4">
          <ToggleReservationState reservation={reservation} />
        </div>
      </CardDetail.State>
      <CardDetail.LastUpdate
        name={lastModifier.name}
        updatedAt={new Date(lastModifier.updatedAt).toLocaleString()}
      />
      <CardDetail.Memo>{memo}</CardDetail.Memo>
    </CardDetail>
  );
}
