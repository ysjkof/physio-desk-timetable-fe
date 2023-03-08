import {
  eachDayOfInterval,
  endOfWeek,
  isSameDay,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from '../../../../svgs';
import { setPickedDate, useStore } from '../../../../store';
import EventListItem from './EventListItem';
import DateBtn from './DateBtn';
import ChangeDayBtn from './ChangeDayBtn';
import type { ISchedules } from '../../../../types/commonTypes';
import { ReservationState } from '../../../../types/generatedTypes';

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

  const countOfReservation = sortedEvents.length;
  let countOfFirst = 0;
  let countOfCancel = 0;
  let countOfNoshow = 0;

  sortedEvents.forEach((event) => {
    if (event.isFirst) countOfFirst += 1;
    if (event.state === ReservationState.Canceled) return (countOfCancel += 1);
    if (event.state === ReservationState.NoShow) return (countOfNoshow += 1);
  });

  return (
    <div className="event-list h-full overflow-y-scroll">
      <div className="sticky top-0 bg-white shadow-b">
        <div className="schedules__date-title">예약 목록</div>
        <div className="flex justify-around">
          {weekDates.map((date, idx) => (
            <DateBtn
              key={idx}
              isSunday={idx === 0}
              isSaturday={idx === 6}
              date={date}
              enabled={isSameDay(pickedDate, date)}
            />
          ))}
        </div>
        <div className="flex gap-x-0.5">
          <ChangeDayBtn onClick={() => setPickedDate(undefined, -1)}>
            <ChevronLeft />
            어제
          </ChangeDayBtn>
          <ChangeDayBtn onClick={() => setPickedDate(undefined, 1)}>
            내일
            <ChevronRight />
          </ChangeDayBtn>
          <ChangeDayBtn onClick={() => setPickedDate(undefined, -7)}>
            <ChevronLeft />
            <ChevronLeft />
            지난주
          </ChangeDayBtn>
          <ChangeDayBtn onClick={() => setPickedDate(undefined, 7)}>
            다음주
            <ChevronRight />
            <ChevronRight />
          </ChangeDayBtn>
          <ChangeDayBtn onClick={() => setPickedDate(startOfDay(new Date()))}>
            오늘
          </ChangeDayBtn>
        </div>
        <div className="flex justify-around py-2">
          <span>총예약: {countOfReservation}</span>
          <span>신환: {countOfFirst}</span>
          <span>취소: {countOfCancel}</span>
          <span>부도: {countOfNoshow}</span>
        </div>
      </div>
      <ul className="mt-4 flex flex-col gap-y-2">
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

export default EventList;
