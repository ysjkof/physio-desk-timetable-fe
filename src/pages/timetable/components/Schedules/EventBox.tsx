import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCancel,
  faCommentSlash,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import {
  TABLE_CELL_HEIGHT,
  USER_COLORS,
} from '../../../../constants/constants';
import { cls } from '../../../../utils/commonUtils';
import TooltipForReservationDetail from './TooltipForReservation';
import {
  type Reservation,
  ReservationState,
} from '../../../../types/generatedTypes';
import type {
  PatientInReservation,
  ReservationInList,
} from '../../../../types/commonTypes';
import { useStore } from '../../../../store';

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
  const [isHover, setIsHover] = useState(false);

  const personalColor = USER_COLORS[userIndex]?.deep || 'inherit';

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

  const showCancelOfTimetable = useStore(
    (state) => state.showCancelOfTimetable
  );
  const showNoshowOfTimetable = useStore(
    (state) => state.showNoshowOfTimetable
  );

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
        !showCancelOfTimetable && isCancel ? 'hidden' : '',
        !showNoshowOfTimetable && isNoshow ? 'hidden' : '',
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
          'relative flex h-full flex-col items-start justify-center overflow-hidden border-l-4 bg-white pl-0.5',
          !isReserve ? 'no-reserved' : ''
        )}
        style={{
          ...(isReserve && {
            borderColor: personalColor,
            color: personalColor,
          }),
        }}
      >
        <div className="flex h-5 w-full items-center overflow-hidden whitespace-nowrap text-center">
          <StatusIcon eventState={event.state} />
          <Name
            eventState={event.state}
            registrationNumber={event.patient?.registrationNumber}
            patientName={event.patient?.name}
          />
          <MemoNotification memo={event.memo} />
        </div>
        <Prescriptions
          isDayOff={isDayOff}
          numberOfCell={numberOfCell}
          prescriptions={event.prescriptions}
        />
      </div>
      {isHover && (
        <TooltipForReservationDetail reservation={event} ref={tooltip} />
      )}
    </motion.div>
  );
};

interface EventStateProps {
  eventState: ReservationState;
}

const StatusIcon = ({ eventState }: EventStateProps) => {
  if (eventState === ReservationState.DayOff)
    return <FontAwesomeIcon icon={faLock} className="cancel mx-auto" />;
  if (eventState === ReservationState.Canceled)
    return <FontAwesomeIcon icon={faCancel} className="cancel" />;
  if (eventState === ReservationState.NoShow)
    return <FontAwesomeIcon icon={faCommentSlash} className="noshow" />;
  return null;
};

interface NameProps extends EventStateProps {
  registrationNumber: PatientInReservation['registrationNumber'] | undefined;
  patientName: PatientInReservation['name'] | undefined;
}

const Name = ({ eventState, registrationNumber, patientName }: NameProps) => {
  if (eventState === ReservationState.DayOff) return null;
  return (
    <div className="flex w-full gap-0.5">
      <span>{registrationNumber}</span>
      <span className="overflow-hidden text-ellipsis text-black">
        {patientName}
      </span>
    </div>
  );
};

interface MemoNotificationProps {
  memo: Reservation['memo'];
}

const MemoNotification = ({ memo }: MemoNotificationProps) => {
  if (!memo) return null;
  return (
    <div className="absolute right-0 top-0 border-4 border-t-red-500 border-r-red-500 border-l-transparent border-b-transparent" />
  );
};

interface PrescriptionsProps {
  isDayOff: boolean;
  prescriptions: EventBoxProps['event']['prescriptions'];
  numberOfCell: number;
}

const Prescriptions = ({
  isDayOff,
  prescriptions,
  numberOfCell,
}: PrescriptionsProps) => {
  if (isDayOff || !prescriptions || numberOfCell === 1) return null;
  return (
    <div className="h-5 overflow-hidden text-ellipsis whitespace-nowrap text-center">
      {prescriptions.map((prescription) => `${prescription.name} `)}
    </div>
  );
};

export default EventBox;
