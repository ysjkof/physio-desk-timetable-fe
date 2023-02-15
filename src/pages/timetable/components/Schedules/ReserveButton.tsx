import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFrom4DigitTime, getTimeLength } from '../../../../utils/dateUtils';
import {
  TABLE_CELL_HEIGHT,
  USER_COLORS,
} from '../../../../constants/constants';
import { cls } from '../../../../utils/commonUtils';
import type { PickedReservationType } from '../../../../types/commonTypes';

interface ReserveBtnProps {
  label: string;
  dayIndex: number;
  userId: number;
  userIndex: number;
  isActiveBorderTop: boolean;
  pickedReservation: PickedReservationType;
  quickCreateReservation: () => void;
}

const ReserveButton = ({
  label,
  dayIndex,
  userId,
  userIndex,
  isActiveBorderTop = false,
  pickedReservation,
  quickCreateReservation,
}: ReserveBtnProps) => {
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);

  const openReserveModal = () => {
    navigate('', {
      state: {
        createReservation: true,
        startDate: {
          hours: Number.parseInt(getFrom4DigitTime(label, 'hour'), 10),
          minutes: Number.parseInt(getFrom4DigitTime(label, 'minute'), 10),
          dayIndex,
        },
        userId,
      },
    });
  };

  const handleClickButton = () => {
    if (pickedReservation) {
      quickCreateReservation();
    } else {
      openReserveModal();
    }
  };

  const activateHover = () => setIsHover(true);
  const deactivateHover = () => setIsHover(false);

  return (
    <div
      className={cls(
        'reserve-btn-box group',
        isActiveBorderTop ? ' border-t border-gray-200 first:border-t-0' : ''
      )}
      onMouseOver={activateHover}
      onFocus={activateHover}
      onMouseLeave={deactivateHover}
      onBlur={deactivateHover}
      onClick={handleClickButton}
      onKeyDown={handleClickButton}
      tabIndex={0}
      role="button"
    >
      <span className="reserve-btn">+ {label}</span>
      {pickedReservation && isHover && (
        <div
          className="absolute top-0 w-full border-2"
          style={{
            borderColor: USER_COLORS[userIndex]?.deep ?? 'black',
            height: `${
              getTimeLength(
                pickedReservation.startDate,
                pickedReservation.endDate,
                '20minute'
              ) * TABLE_CELL_HEIGHT
            }px`,
          }}
        />
      )}
    </div>
  );
};

export default ReserveButton;
