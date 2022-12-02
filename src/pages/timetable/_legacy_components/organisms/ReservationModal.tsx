import { useLocation, useNavigate } from 'react-router-dom';
import { useListReservations } from '../../hooks';
import ModalContentsLayout from '../../../../_legacy_components/templates/ModalContentsLayout';
import ModalTemplate from '../../../../_legacy_components/templates/ModalTemplate';
import ReservationCard from '../molecules/ReservationCard';
import DayOffCard from '../molecules/DayOffCard';
import { ReservationState } from '../../../../types/generated.types';
import { CloseAction } from '../../../../types/props.types';

export default function ReservationModal({ closeAction }: CloseAction) {
  const navigate = useNavigate();
  const location = useLocation();
  const { reservationId } = location.state;
  const { data } = useListReservations();

  const reservation = data?.listReservations.results?.find(
    ({ id }) => id === reservationId
  );

  const isDayOff = reservation?.state === ReservationState.DayOff;

  return (
    <ModalTemplate closeAction={closeAction}>
      <ModalContentsLayout
        title={isDayOff ? '예약잠금 설정' : '예약 자세히'}
        closeAction={closeAction}
      >
        <>
          {!reservation ? (
            <p>
              데이터가 없습니다. 돌아가서 다시 시도해주세요
              <button
                className="btn-menu mx-auto block font-semibold"
                onClick={() => navigate(-1)}
                type="button"
              >
                누르세요
              </button>
            </p>
          ) : (
            <>
              {isDayOff ? (
                <DayOffCard
                  closeAction={closeAction}
                  reservation={reservation}
                />
              ) : (
                <ReservationCard
                  closeAction={closeAction}
                  reservation={reservation}
                />
              )}
            </>
          )}
        </>
      </ModalContentsLayout>
    </ModalTemplate>
  );
}
