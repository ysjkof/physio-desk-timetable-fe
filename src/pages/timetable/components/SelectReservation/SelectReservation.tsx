import { MenuButton } from '../../../../components';
import { selectedReservationVar } from '../../../../store';
import { cls } from '../../../../utils/common.utils';
import type { ReservationInList } from '../../../../types/common.types';

interface SelectReservationProps {
  reservation: ReservationInList;
}
const SelectReservation = ({ reservation }: SelectReservationProps) => {
  const select = () => {
    selectedReservationVar(reservation);
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

export default SelectReservation;
