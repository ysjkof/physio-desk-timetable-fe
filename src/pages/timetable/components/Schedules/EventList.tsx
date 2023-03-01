import {
  differenceInMinutes,
  eachDayOfInterval,
  endOfWeek,
  isSameDay,
  startOfWeek,
} from 'date-fns';
import { PropsWithChildren } from 'react';
import { getStringOfTime } from '../../../../utils/dateUtils';
import { ChevronLeft, ChevronRight, PersonPlus } from '../../../../svgs';
import { setPickedDate, useStore } from '../../../../store';
import { cls } from '../../../../utils/commonUtils';
import type { ISchedules } from '../../../../types/commonTypes';
import type { ReservationInList } from '../../../../types/processedGeneratedTypes';
import { LOCALE } from '../../../../constants/constants';

const EventList = ({ events }: { events: ISchedules }) => {
  const sortedEvents = events.members
    .flat(1)
    .map((member) => member.events)
    .flat(1)
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

  const pickedDate = useStore((state) => state.pickedDate);

  const weekDates = eachDayOfInterval({
    start: startOfWeek(pickedDate),
    end: endOfWeek(pickedDate),
  });

  return (
    <div className="flex basis-full flex-col pl-2 pr-6">
      <div className="timetable-date-title">예약 목록</div>
      <div className="timetable-member-name-title flex justify-around">
        {weekDates.map((date, idx) => (
          <WeekDateBtn
            key={idx}
            isSunday={idx === 0}
            isSaturday={idx === 0}
            date={date}
            enabled={isSameDay(pickedDate, date)}
          />
        ))}
      </div>
      <div className="timetable-member-name-title flex">
        <CalcDayBtn onClick={() => setPickedDate(undefined, -1)}>
          <ChevronLeft />
          어제
        </CalcDayBtn>
        <CalcDayBtn onClick={() => setPickedDate(undefined, 1)}>
          내일
          <ChevronRight />
        </CalcDayBtn>
        <CalcDayBtn onClick={() => setPickedDate(undefined, -7)}>
          <ChevronLeft />
          <ChevronLeft />
          지난주
        </CalcDayBtn>
        <CalcDayBtn onClick={() => setPickedDate(undefined, 7)}>
          다음주
          <ChevronRight />
          <ChevronRight />
        </CalcDayBtn>
        <CalcDayBtn onClick={() => setPickedDate(new Date())}>오늘</CalcDayBtn>
      </div>
      <ul className="flex h-screen flex-col gap-4 overflow-y-scroll shadow-b">
        {sortedEvents.length === 0 ? (
          <span className="mt-5 text-center text-xl">예약이 없습니다</span>
        ) : (
          sortedEvents.map((event) => {
            return <EventListItem key={event.id} event={event} />;
          })
        )}
      </ul>
    </div>
  );
};

interface WeekDateBtnProps {
  date: Date;
  isSunday: boolean;
  isSaturday: boolean;
  enabled: boolean;
}

const WeekDateBtn = ({
  date,
  isSunday,
  isSaturday,
  enabled,
}: WeekDateBtnProps) => {
  return (
    <button
      type="button"
      onClick={() => setPickedDate(date)}
      className={cls(
        'mx-1 mb-2 w-full border-b-2 border-transparent font-medium',
        isSunday ? 'sunday' : '',
        isSaturday ? 'saturday' : '',
        enabled ? 'border-table-day-strong font-bold' : ''
      )}
    >
      {date.getDate()}
    </button>
  );
};

interface CalcDayBtnProps extends PropsWithChildren {
  onClick: () => void;
}

const CalcDayBtn = ({ onClick, children }: CalcDayBtnProps) => {
  return (
    <button
      className="flex grow items-center justify-center rounded-sm border hover:border-gray-400"
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

interface EventListItemProps {
  event: ReservationInList;
}

const EventListItem = ({ event }: EventListItemProps) => {
  const { user, patient, startDate, endDate, prescriptions } = event;

  const patientNumber = new Intl.NumberFormat(LOCALE).format(
    patient?.registrationNumber || 0
  );

  const prescriptionsName = prescriptions?.map((p) => p.name).join();

  const time = `${getStringOfTime(new Date(startDate))} ~ ${getStringOfTime(
    new Date(endDate)
  )}(${differenceInMinutes(new Date(endDate), new Date(startDate))}분)`;

  return (
    <li className="flex items-center gap-4 rounded-lg border bg-white px-4 py-3">
      <EventListItemIcon />
      <div className="flex flex-col text-base">
        <div className="flex gap-2">
          <span>{patient?.name}</span>
          <span className="text-orange-500">{patientNumber}</span>
        </div>
        <span>{user.name}</span>
        <div className="flex flex-wrap gap-4">
          <span>{prescriptionsName}</span>
          <span>{time}</span>
        </div>
      </div>
    </li>
  );
};

const EventListItemIcon = () => {
  return (
    <div className="flex aspect-square h-full items-center justify-center rounded-lg bg-[#6BA6FF] p-1 text-white">
      <PersonPlus className="h-full w-full" />
    </div>
  );
};

export default EventList;
