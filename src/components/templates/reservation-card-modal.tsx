import { useLocation, useNavigate } from "react-router-dom";
import { TimetableModalProps } from "../../pages/timetable";
import { ModalContentsLayout } from "../templates/modal-contents-layout";
import { ModalTemplate } from "../molecules/modal-template";
import { ReservationCard } from "../organisms/reservation-card";
import { useListReservations } from "../../hooks/useListReservations";

export const ReservationModal = ({ closeAction }: TimetableModalProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  //@ts-ignore
  const reservationId = location.state?.reservationId;
  const { data } = useListReservations();
  const reservation = data?.listReservations.results?.find(
    (r) => r.id === reservationId
  )!;

  return (
    <ModalTemplate
      closeAction={closeAction}
      children={
        <ModalContentsLayout
          title="예약 자세히"
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
                <ReservationCard
                  closeAction={closeAction}
                  reservation={reservation}
                />
              )}
            </>
          }
        />
      }
    />
  );
};
