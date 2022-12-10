import { endOfYesterday } from 'date-fns';
import { useContext } from 'react';
import { CalendarDate } from '../../models/CalendarDate';
import { cls } from '../../utils/common.utils';
import { compareDateMatch, isPastDate } from '../../utils/date.utils';
import { DatepickerContext } from './DatepickerStore';

export const DatepickerMain = () => {
  const yesterDay = endOfYesterday();
  const { month } = useContext(DatepickerContext);

  return (
    <div className="flex">
      <div className="grid w-full grid-cols-7 pr-1.5 text-center">
        <Title />
        {month.map((day) => {
          const isActivate = !isPastDate(day.getDate(), yesterDay);
          return (
            <CalendarDay
              isActivate={isActivate}
              key={day.getDate().valueOf()}
              date={day}
            />
          );
        })}
      </div>
    </div>
  );
};

const Title = () => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return (
    <>
      {days.map((day, index) => (
        <div
          key={`datepicker__calendar-day${day}`}
          className={cls(
            'mb-2 font-medium',
            index === 0 ? 'sunday' : '',
            index === 6 ? 'saturday' : ''
          )}
        >
          {day}
        </div>
      ))}
    </>
  );
};

interface CalendarDayProps {
  date: CalendarDate;
  isActivate: boolean;
}

const CalendarDay = ({ date, isActivate }: CalendarDayProps) => {
  const selectedDate = new Date(); // TODO: 상위 컴포넌트에서 전달받아야함
  const isSelect = compareDateMatch(date.getDate(), selectedDate, 'ymd');

  return (
    <button
      type="button"
      className={cls(
        'm-1 cursor-pointer p-1',
        isActivate ? '' : 'pointer-events-none line-through',
        date.isSunday() ? 'sunday' : '',
        date.isSaturday() ? 'saturday' : '',
        date.isThisMonth() ? '' : 'opacity-50',
        date.isToday() ? 'rounded-full bg-blue-400 text-white' : '',
        isSelect ? 'rounded-full ring-2 ring-blue-500' : ''
      )}
    >
      {date.getDay()}
    </button>
  );
};
