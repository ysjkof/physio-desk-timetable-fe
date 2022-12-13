import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCancel,
  faCommentSlash,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { tableDisplayVar } from '../../../../store';
import {
  TABLE_CELL_HEIGHT,
  USER_COLORS,
} from '../../../../constants/constants';
import { cls } from '../../../../utils/common.utils';
import { ReservationState } from '../../../../types/generated.types';
import type { ReservationInList } from '../../../../types/common.types';
import TooltipForReservationDetail from './TooltipForReservation';

interface EventBoxProps {
  userIndex: number;
  inset: string;
  maxTableHeight: number;
  numberOfCell: number;
  event: ReservationInList;
  isSingleUser: boolean;
}

const EventBox = ({
  userIndex,
  inset,
  maxTableHeight,
  numberOfCell,
  event,
}: EventBoxProps) => {
  const navigate = useNavigate();
  const tableDisplay = useReactiveVar(tableDisplayVar);
  const [isHover, setIsHover] = useState(false);

  const isDayOff = event.state === ReservationState.DayOff;
  const isReserve = event.state === ReservationState.Reserved;
  const isCancel = event.state === ReservationState.Canceled;
  const isNoshow = event.state === ReservationState.NoShow;

  let height = numberOfCell * TABLE_CELL_HEIGHT;

  if (height > maxTableHeight) height = maxTableHeight;

  const eventBox = useRef<HTMLDivElement>(null);
  const tooltip = useRef<HTMLDivElement>(null);

  const positioningTooltip = () => {
    if (!eventBox.current || !tooltip.current) return;

    const { clientHeight: boxHeight, parentElement: eventBoxParentElement } =
      eventBox.current;
    if (!eventBoxParentElement) throw new Error('이벤트 박스가 없습니다.');

    const { clientHeight: userColsWidth } = eventBoxParentElement;

    const columnContainer = document.getElementById('timetable__template');
    if (!columnContainer) throw new Error('스케쥴 컨테이너가 없습니다.');

    const { clientHeight: columnViewportHeight } = columnContainer;

    const {
      right: tooltipRight,
      width: tooltipWidth,
      bottom: tooltipBottom,
    } = tooltip.current.getBoundingClientRect();

    if (tooltipRight > userColsWidth) {
      tooltip.current.classList.remove('left-[90px]');
      tooltip.current.style.left = `-${tooltipWidth}px`;
    }

    if (tooltipBottom > columnViewportHeight) {
      tooltip.current.classList.remove('top-5');

      const boxTop = +inset.split('px')[0];
      const boxBottom = boxHeight + boxTop;
      const isOverflow = maxTableHeight < boxBottom;

      if (isOverflow) {
        tooltip.current.style.bottom = `${boxBottom - maxTableHeight}px`;
      } else {
        tooltip.current.style.top = `-${
          tooltipBottom - columnViewportHeight
        }px`;
      }
    }
  };

  function onClickBox() {
    navigate('', { state: { reservationId: event.id } });
  }

  useEffect(() => {
    if (isHover) positioningTooltip();
  }, [isHover]);

  return (
    <motion.div
      ref={eventBox}
      whileHover={{ zIndex: 32 }}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
      className={cls(
        'EVENT_BOX group absolute z-30 cursor-pointer',
        !tableDisplay.seeCancel && isCancel ? 'hidden' : '',
        !tableDisplay.seeNoshow && isNoshow ? 'hidden' : '',
        isDayOff ? 'z-[31]' : ''
      )}
      style={{ inset, height }}
    >
      <div
        onClick={onClickBox}
        onKeyDown={onClickBox}
        role="button"
        tabIndex={0}
        className={cls(
          'relative h-full overflow-hidden border-l-8 bg-white px-1',
          !isReserve ? 'no-reserved' : ''
        )}
        style={{
          ...(isReserve && {
            borderColor: USER_COLORS[userIndex]?.deep ?? 'black',
          }),
        }}
      >
        <div className="flex h-5 items-center justify-between overflow-hidden whitespace-nowrap text-center">
          {isDayOff && <FontAwesomeIcon icon={faLock} className="cancel" />}
          {isCancel && <FontAwesomeIcon icon={faCancel} className="cancel" />}
          {isNoshow && (
            <FontAwesomeIcon icon={faCommentSlash} className="noshow" />
          )}
          <span className="ml-0.5 w-full font-extralight">
            {isDayOff
              ? '예약잠금'
              : `${event.patient?.registrationNumber}:${event.patient?.name}`}
          </span>
          {event.memo && (
            <div className="absolute right-0 top-0 border-4 border-t-red-500 border-r-red-500 border-l-transparent border-b-transparent" />
          )}
        </div>
        {!isDayOff && event.prescriptions && numberOfCell !== 1 && (
          <div className="h-5 overflow-hidden text-ellipsis whitespace-nowrap text-center">
            {event.prescriptions.map((prescription) => `${prescription.name} `)}
          </div>
        )}

        {
          numberOfCell > 2 && event.memo && (
            <div
              className="overflow-hidden break-all font-extralight leading-5"
              style={{ height: (numberOfCell - 2) * TABLE_CELL_HEIGHT }}
            >
              {event.memo}
            </div>
          ) // 칸이 없어서 메모 생략
        }
      </div>
      {isHover && (
        <TooltipForReservationDetail reservation={event} ref={tooltip} />
      )}
    </motion.div>
  );
};

export default EventBox;
