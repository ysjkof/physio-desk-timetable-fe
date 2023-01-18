import { forwardRef } from 'react';
import { ReservationDetail } from '../ReservationDetail';
import { Trash } from '../../../../svgs';
import { useDeleteReservation } from '../../hooks';
import type { ReservationInList } from '../../../../types/common.types';

interface TooltipForReservationDetailProps {
  reservation: ReservationInList;
}

const TooltipForReservationDetail = forwardRef<
  HTMLDivElement,
  TooltipForReservationDetailProps
>((props, ref) => {
  const { reservation } = props;

  const { deleteReservation } = useDeleteReservation();

  return (
    <div
      ref={ref}
      className="absolute top-5 left-[90px] cursor-default rounded border border-navy bg-white shadow-cst"
    >
      <ReservationDetail reservation={reservation} />
      <button
        type="button"
        onClick={() => deleteReservation({ reservationId: reservation.id })}
        className="absolute top-16 right-4"
      >
        <Trash iconSize="LG" />
      </button>
    </div>
  );
});

TooltipForReservationDetail.displayName = 'TooltipForReservationDetail';

export default TooltipForReservationDetail;
