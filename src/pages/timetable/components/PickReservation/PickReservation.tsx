import { MenuButton } from '../../../../components';
import { cls } from '../../../../utils/commonUtils';
import { setPickedReservation } from '../../../../store';
import type { ReservationOfGetReservationsByInterval } from '../../../../types/processedGeneratedTypes';

interface PickReservationProps {
  reservation: ReservationOfGetReservationsByInterval;
}
const PickReservation = ({ reservation }: PickReservationProps) => {
  const select = () => {
    setPickedReservation(reservation);
  };
  return (
    <MenuButton
      hasBorder
      onClick={select}
      className={cls(
        'flex h-5 cursor-pointer items-center justify-center rounded-md border-navy text-xs text-navy'
      )}
    >
      예약복사
    </MenuButton>
  );
};

export default PickReservation;
