import { useLocation, useNavigate } from 'react-router-dom';
import { TimetableModalProps } from '..';
import { ModalContentsLayout } from '../../../components/templates/ModalContentsLayout';
import { ModalTemplate } from '../../../components/molecules/ModalTemplate';
import { ReservationCard } from '../molecules/ReservationCard';
import { useListReservations } from '../../../hooks/useListReservations';
import { ReservationState } from '../../../graphql/generated/graphql';
import { DayOffCard } from '../molecules/DayOffCard';

export const ReservationModal = ({ closeAction }: TimetableModalProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  //@ts-ignore
  const reservationId = location.state?.reservationId;
  const { data } = useListReservations();
  const reservation = data?.listReservations.results?.find(
    (r) => r.id === reservationId
  )!;

  const isDayOff = reservation?.state === ReservationState.DayOff;

  return (
    <ModalTemplate
      closeAction={closeAction}
      children={
        <ModalContentsLayout
          title={isDayOff ? '예약잠금 설정' : '예약 자세히'}
          closeAction={closeAction}
          children={
            <>
              {!reservation ? (
                <p>
                  데이터가 없습니다. 돌아가서 다시 시도해주세요
                  <button
                    className="btn-menu mx-auto block font-semibold"
                    onClick={() => navigate(-1)}
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
          }
        />
      }
    />
  );
};
