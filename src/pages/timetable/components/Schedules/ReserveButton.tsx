import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFrom4DigitTime, getTimeLength } from '../../../../utils/date.utils';
import {
  TABLE_CELL_HEIGHT,
  USER_COLORS,
} from '../../../../constants/constants';
import { ROUTES } from '../../../../router/routes';
import { cls } from '../../../../utils/utils';
import type { SelectedReservationType } from '../../../../types/common.types';

interface ReserveBtnProps {
  label: string;
  dayIndex: number;
  userId: number;
  userIndex: number;
  isActiveBorderTop?: boolean;
  selectedReservation: SelectedReservationType;
  quickCreateReservation: () => void;
}

function ReserveButton({
  label,
  dayIndex,
  userId,
  userIndex,
  isActiveBorderTop = false,
  selectedReservation,
  quickCreateReservation,
}: ReserveBtnProps) {
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);

  const openReserveModal = () => {
    navigate(ROUTES.reserve, {
      state: {
        startDate: {
          hour: +getFrom4DigitTime(label, 'hour'),
          minute: +getFrom4DigitTime(label, 'minute'),
          dayIndex,
        },
        userId,
      },
    });
  };

  const handleClickButton = () => {
    if (selectedReservation) {
      quickCreateReservation();
    } else {
      openReserveModal();
    }
  };

  return (
    <div
      className={cls(
        'reserve-btn-box group',
        isActiveBorderTop ? ' border-t border-gray-200 first:border-t-0' : ''
      )}
      onMouseOver={(e) => {
        if (selectedReservation) setIsHover(true);
      }}
      onMouseLeave={(e) => {
        if (selectedReservation) setIsHover(false);
      }}
      onClick={handleClickButton}
    >
      <span className="reserve-btn">+ {label}</span>
      {selectedReservation && isHover && (
        <div
          className="absolute top-0 w-full border-2"
          style={{
            borderColor: USER_COLORS[userIndex]?.deep ?? 'black',
            height:
              getTimeLength(
                selectedReservation.startDate,
                selectedReservation.endDate,
                '20minute'
              ) *
                TABLE_CELL_HEIGHT +
              'px',
          }}
        />
      )}
    </div>
  );
}

export default ReserveButton;
