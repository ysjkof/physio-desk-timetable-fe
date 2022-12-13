import { useReactiveVar } from '@apollo/client';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MenuButton } from '../../../../components';
import { selectedReservationVar } from '../../../../store';
import { cls } from '../../../../utils/common.utils';
import { ReservationState } from '../../../../types/generated.types';
import type { ReservationInList } from '../../../../types/common.types';

interface SelectReservationProps {
  reservation: ReservationInList;
}
const SelectReservation = ({ reservation }: SelectReservationProps) => {
  const selectedReservation = useReactiveVar(selectedReservationVar);
  const select = () => {
    selectedReservationVar(reservation);
  };
  return (
    <MenuButton
      onClick={select}
      className={cls(
        'flex w-full cursor-pointer items-center justify-center gap-1 rounded-md py-2 text-sm text-white hover:text-black',
        selectedReservation?.id === reservation.id &&
          reservation.state === ReservationState.Reserved
          ? 'bg-cst-blue'
          : 'bg-gray-400'
      )}
    >
      <FontAwesomeIcon icon={faCopy} fontSize={16} />
      예약복사
    </MenuButton>
  );
};

export default SelectReservation;
