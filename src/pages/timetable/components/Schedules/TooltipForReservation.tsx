import { forwardRef } from 'react';
import { ReservationDetail } from '../ReservationDetail';
import type { ReservationOfGetReservationsByInterval } from '../../../../types/processedGeneratedTypes';

interface TooltipForReservationDetailProps {
  reservation: ReservationOfGetReservationsByInterval;
}

const TooltipForReservationDetail = forwardRef<
  HTMLDivElement,
  TooltipForReservationDetailProps
>((props, ref) => {
  const { reservation } = props;

  return (
    <div
      ref={ref}
      className="absolute top-5 left-[84px] cursor-default rounded border border-navy bg-white shadow-cst"
    >
      <ReservationDetail reservation={reservation} />
    </div>
  );
});

TooltipForReservationDetail.displayName = 'TooltipForReservationDetail';

export default TooltipForReservationDetail;
