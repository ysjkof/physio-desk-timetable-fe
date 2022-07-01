import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { TimetableModalProps } from "../../pages/timetable";
import {
  ListReservationsDocument,
  useDeleteReservationMutation,
} from "../../graphql/generated/graphql";
import { BtnMenu } from "../molecules/button-menu";
import { ReserveForm } from "../../pages/timetable/molecules/reserve-form";
import { IListReservation } from "../../store";
import { ReservationCardDetail } from "../molecules/reservation-card-detail";

interface DayOffCardProps extends TimetableModalProps {
  reservation: IListReservation;
}

export const DayOffCard = ({ closeAction, reservation }: DayOffCardProps) => {
  const [isEdit, setIsEdit] = useState(false);

  const [deleteReservationMutation] = useDeleteReservationMutation({});

  const onClickDelete = () => {
    const confirmDelete = window.confirm("예약을 지웁니다.");
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
        refetchQueries: [
          { query: ListReservationsDocument },
          "listReservations",
        ],
      });
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="mb-5 text-left font-medium"></h4>

      <div className="reservation-editor flex justify-around">
        <BtnMenu
          icon={<FontAwesomeIcon icon={faTrashCan} fontSize={14} />}
          enabled
          label={"삭제"}
          onClick={onClickDelete}
        />
        <BtnMenu
          icon={<FontAwesomeIcon icon={faEdit} fontSize={14} />}
          enabled={isEdit}
          label={"수정"}
          onClick={() => setIsEdit((prev) => !prev)}
        />
      </div>

      <div className="h-full overflow-y-scroll">
        {!isEdit && <ReservationCardDetail reservation={reservation} />}
        {isEdit && (
          <ReserveForm closeAction={closeAction} reservation={reservation} />
        )}
      </div>
    </div>
  );
};
