import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getFrom4DigitTime,
  getTimeLength,
} from '../../../services/dateServices';
import { TABLE_CELL_HEIGHT, USER_COLORS } from '../../../constants/constants';
import { ROUTER } from '../../../router/routerConstants';
import { IListReservation } from '../../../types/type';

interface ReserveBtnProps {
  label: string;
  dayIndex: number;
  userId: number;
  userIndex: number;
  isActiveBorderTop?: boolean;
  selectedReservation: IListReservation | null;
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
    navigate(ROUTER.RESERVE, {
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
      className={`reserve-btn-box group ${
        isActiveBorderTop ? ' border-t border-gray-200 first:border-t-0' : ''
      }`}
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

// export default memo(ReserveButton);
export default ReserveButton;

// export default memo(ReserveButton, (prevProps, nextProps) => {
//   // console.log(
//   //   prevProps.date,
//   //   nextProps.date,
//   //   compareDateMatch(prevProps.date, nextProps.date, 'ymd')
//   // );

//   return true;
// });
