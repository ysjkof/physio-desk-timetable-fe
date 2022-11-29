import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCancel,
  faCommentSlash,
  faCopy,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import {
  compareTableEndtime,
  getTimeString,
} from '../../../../services/dateServices';
import {
  selectedReservationVar,
  tableDisplayVar,
  tableTimeVar,
} from '../../../../store';
import {
  TABLE_CELL_HEIGHT,
  USER_COLORS,
} from '../../../../constants/constants';
import EditReservationState from '../../_legacy_components/molecules/EditReservationState';
import { cls } from '../../../../utils/utils';
import { ROUTES } from '../../../../router/routes';
import { ReservationState } from '../../../../types/generated.types';
import type { Reservation } from '../../../../types/common.types';

interface EventBoxProps {
  userIndex: number;
  inset: string;
  maxTableHeight: number;
  numberOfCell: number;
  event: Reservation;
  isSingleUser: boolean;
}

export default function EventBox({
  userIndex,
  inset,
  maxTableHeight,
  numberOfCell,
  event,
  isSingleUser,
}: EventBoxProps) {
  const navigate = useNavigate();
  const tableDisplay = useReactiveVar(tableDisplayVar);
  const tableTime = useReactiveVar(tableTimeVar);
  const [isHover, setIsHover] = useState(false);

  const isDayOff = event.state === ReservationState.DayOff;
  const isReserve = event.state === ReservationState.Reserved;
  const isCancel = event.state === ReservationState.Canceled;
  const isNoshow = event.state === ReservationState.NoShow;

  let height = numberOfCell * TABLE_CELL_HEIGHT;

  if (height > maxTableHeight) height = maxTableHeight;

  const matchTableEndtime = compareTableEndtime(new Date(event.endDate), {
    hour: tableTime.lastHour,
    minute: tableTime.lastMinute,
  });

  if (matchTableEndtime) height = height;

  const eventBox = useRef<HTMLDivElement>(null);
  const eventController = useRef<HTMLDivElement>(null);
  const tooltip = useRef<HTMLDivElement>(null);

  const positioningTooltip = () => {
    if (eventBox.current && tooltip.current && eventController.current) {
      const {
        offsetTop: eventBoxTop,
        clientHeight: boxHeight,
        parentElement: eventBoxParentElement,
      } = eventBox.current;
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

      if (eventBoxTop === 0) {
        eventController.current.classList.remove('-top-[1.2rem]');
      }
    }
  };

  function onClickBox() {
    navigate(ROUTES.edit_reservation, { state: { reservationId: event.id } });
  }
  const selectReservation = () => {
    selectedReservationVar(event);
  };

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
        !tableDisplay.seeCancel && isCancel
          ? 'hidden'
          : !tableDisplay.seeNoshow && isNoshow
          ? 'hidden'
          : '',
        isDayOff ? 'z-[31]' : ''
      )}
      style={{ inset, height }}
    >
      <div
        onClick={onClickBox}
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
              : event.patient?.registrationNumber + ':' + event.patient?.name}
          </span>
          {event.memo && (
            <div className="absolute right-0 top-0 border-4 border-t-red-500 border-r-red-500 border-l-transparent border-b-transparent" />
          )}
        </div>
        {!isDayOff && event.prescriptions && numberOfCell !== 1 && (
          <div className="h-5 overflow-hidden text-ellipsis whitespace-nowrap text-center">
            {event.prescriptions.map((prescription) => prescription.name + ' ')}
          </div>
        )}

        {
          numberOfCell > 2 ? (
            event.memo ? (
              <div
                className="overflow-hidden break-all font-extralight leading-5"
                style={{ height: (numberOfCell - 2) * TABLE_CELL_HEIGHT }}
              >
                {event.memo}
              </div>
            ) : null
          ) : null // 칸이 없어서 메모 생략
        }
      </div>

      {isHover && (
        <>
          {!isDayOff && (
            <motion.div
              ref={eventController}
              initial={{ width: 0 }}
              animate={{
                width: '100%',
                transition: { bounce: 'twin', duration: 0.2 },
              }}
              className="absolute left-0 -top-[1.2rem] flex items-baseline justify-between overflow-hidden bg-gray-100 px-2 pb-[0.2rem] text-gray-800"
            >
              <FontAwesomeIcon
                icon={faCopy}
                fontSize={16}
                className="text-green-500 hover:scale-125"
                onClick={selectReservation}
              />
              <EditReservationState reservation={event} />
            </motion.div>
          )}
          <div
            ref={tooltip}
            className={cls(
              'EVENT-BOX__TOOL-TIP absolute top-5 w-[150px] rounded border p-1 shadow-cst',
              isSingleUser ? 'left-[162px]' : 'left-[90px]',
              !isReserve ? 'no-reserved' : ''
            )}
            style={{
              ...(isReserve && {
                borderColor: USER_COLORS[userIndex]?.deep ?? 'black',
                backgroundColor: USER_COLORS[userIndex]?.light ?? 'white',
              }),
            }}
          >
            <span className="mb-1 flex">
              시간 : {getTimeString(new Date(event.startDate), false)} ~{' '}
              {getTimeString(new Date(event.endDate), false)}
            </span>
            {!isDayOff && (
              <ul className="mb-1 flex flex-col">
                처방 :
                {event.prescriptions?.map((prescription, i) => (
                  <li key={i} className="flex pl-2">
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {prescription.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {event.memo && (
              <div className="flex flex-col pt-1">메모 : {event.memo}</div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
