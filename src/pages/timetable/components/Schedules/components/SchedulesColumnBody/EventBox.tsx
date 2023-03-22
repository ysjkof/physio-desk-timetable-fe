import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faLock } from '@fortawesome/free-solid-svg-icons';
import {
  DEFAULT_COLOR,
  TABLE_CELL_HEIGHT,
} from '../../../../../../constants/constants';
import { cls } from '../../../../../../utils/commonUtils';
import TooltipForReservationDetail from './TooltipForReservation';
import { useStore } from '../../../../../../store';
import { XMark } from '../../../../../../svgs';
import type {
  PatientInReservation,
  ReservationOfGetReservationsByInterval,
} from '../../../../../../types/processedGeneratedTypes';
import {
  type Reservation,
  ReservationState,
} from '../../../../../../types/generatedTypes';

interface EventBoxProps {
  inset: string;
  maxTableHeight: number;
  numberOfCell: number;
  event: ReservationOfGetReservationsByInterval;
  isSingleUser: boolean;
  color: string | undefined;
}

const EventBox = ({
  inset,
  maxTableHeight,
  numberOfCell,
  event,
  color = DEFAULT_COLOR,
}: EventBoxProps) => {
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);
  const eventBox = useRef<HTMLDivElement>(null);

  const isDayOff = event.state === ReservationState.DayOff;
  const isReserve = event.state === ReservationState.Reserved;
  const isCancel = event.state === ReservationState.Canceled;
  const isNoshow = event.state === ReservationState.NoShow;

  let height = numberOfCell * TABLE_CELL_HEIGHT;
  if (height > maxTableHeight) height = maxTableHeight;

  const showCancelOfTimetable = useStore(
    (state) => state.showCancelOfTimetable
  );
  const showNoshowOfTimetable = useStore(
    (state) => state.showNoshowOfTimetable
  );

  const onClickBox = () => {
    navigate('', { state: { reservationId: event.id } });
  };

  return (
    <motion.div
      ref={eventBox}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
      className={cls(
        'schedules__event-box group',
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
          'schedules__event-box-main',
          !isReserve ? 'no-reserved' : ''
        )}
        style={{
          ...(isReserve && {
            color,
            borderColor: color,
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
        <TooltipForReservationDetail
          reservation={event}
          boxRect={eventBox.current?.getBoundingClientRect()}
        />
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
    return <XMark className="cancel h-6 w-6" />;
  if (eventState === ReservationState.NoShow)
    return <FontAwesomeIcon icon={faExclamation} className="noshow h-4 w-4" />;
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
