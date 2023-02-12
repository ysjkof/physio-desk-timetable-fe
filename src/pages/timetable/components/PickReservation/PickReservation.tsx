import { MenuButton } from '../../../../components';
import { cls } from '../../../../utils/common.utils';
import { setPickedReservation } from '../../../../store';
import type { ReservationInList } from '../../../../types/common.types';

interface PickReservationProps {
  reservation: ReservationInList;
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
