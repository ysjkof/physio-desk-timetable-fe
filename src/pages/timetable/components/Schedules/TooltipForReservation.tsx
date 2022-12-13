import { forwardRef } from 'react';
import { SelectReservation } from '../SelectReservation';
import { ToggleReservationState } from '../ToggleReservationState';
import { ReservationDetail } from '../ReservationDetail';
import type { ReservationInList } from '../../../../types/common.types';

interface TooltipForReservationDetailProps {
  reservation: ReservationInList;
}

const TooltipForReservationDetail = forwardRef<
  HTMLDivElement,
  TooltipForReservationDetailProps
>((props, ref) => {
  const { reservation } = props;
  return (
    <div
      ref={ref}
      className="absolute top-5 left-[90px] rounded border border-navy bg-white shadow-cst"
    >
      <ReservationDetail reservation={reservation} />
      <div className="mt-4 mb-2 flex gap-1 px-4">
        <SelectReservation reservation={reservation} />
        <ToggleReservationState reservation={reservation} />
      </div>
    </div>
  );
});

TooltipForReservationDetail.displayName = 'TooltipForReservationDetail';

export default TooltipForReservationDetail;
