import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { endOfYesterday, set, setDay } from 'date-fns';
import {
  getFrom4DigitTime,
  getTimeLength,
  isBeforeDateB,
} from '../../../../../../utils/dateUtils';
import {
  DEFAULT_COLOR,
  TABLE_CELL_HEIGHT,
} from '../../../../../../constants/constants';
import { cls } from '../../../../../../utils/commonUtils';
import { setAlert, setIsCopyMode, useStore } from '../../../../../../store';
import type { PickedReservationType } from '../../../../../../types/commonTypes';

interface ReserveBtnProps {
  label: string;
  dayIndex: number;
  userId: number;
  isActiveBorderTop: boolean;
  pickedReservation: PickedReservationType;
  quickCreateReservation: () => void;
  color: string | undefined;
}

const ReserveBtn = ({
  label,
  dayIndex,
  userId,
  isActiveBorderTop = false,
  pickedReservation,
  quickCreateReservation,
  color,
}: ReserveBtnProps) => {
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);

  const hours = Number.parseInt(getFrom4DigitTime(label, 'hour'), 10);
  const minutes = Number.parseInt(getFrom4DigitTime(label, 'minute'), 10);

  const openReserveModal = () => {
    navigate('', {
      state: {
        createReservation: true,
        startDate: { hours, minutes, dayIndex },
        userId,
      },
    });
  };

  const pickedDate = useStore((state) => state.pickedDate);
  const handleClickButton = () => {
    const btnDate = setDay(set(pickedDate, { hours, minutes }), dayIndex);
    if (isBeforeDateB(endOfYesterday(), btnDate)) {
      return setAlert({ messages: ['지나간 날은 예약할 수 없습니다.'] });
    }
    if (pickedReservation) {
      quickCreateReservation();
      setIsCopyMode(false);
    } else {
      openReserveModal();
    }
  };

  const activateHover = () => setIsHover(true);
  const deactivateHover = () => setIsHover(false);

  return (
    <button
      className={cls(
        'schedules__reserve-btn group',
        isActiveBorderTop ? ' border-t border-gray-200 first:border-t-0' : ''
      )}
      onMouseOver={activateHover}
      onFocus={activateHover}
      onMouseLeave={deactivateHover}
      onBlur={deactivateHover}
      onClick={handleClickButton}
      onKeyDown={handleClickButton}
      type="button"
    >
      <span className="schedules__reserve-btn-label">+ {label}</span>
      {pickedReservation && isHover && (
        <div
          className="absolute top-0 w-full border-2"
          style={{
            borderColor: color || DEFAULT_COLOR,
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
    </button>
  );
};

export default ReserveBtn;
