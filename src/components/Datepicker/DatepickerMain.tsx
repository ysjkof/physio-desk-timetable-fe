import { endOfYesterday } from 'date-fns';
import { useContext } from 'react';
import { CalendarDate } from '../../models/CalendarDate';
import { cls } from '../../utils/common.utils';
import { compareDateMatch, isPastDate } from '../../utils/date.utils';
import { DatepickerContext } from './DatepickerStore';

interface DatepickerMainProps {
  disablePreviousDay: boolean | undefined;
}

export const DatepickerMain = ({ disablePreviousDay }: DatepickerMainProps) => {
  const yesterDay = endOfYesterday();
  const { month } = useContext(DatepickerContext);

  return (
    <div className="flex">
      <div className="grid w-full grid-cols-7 pr-1.5 text-center text-sm">
        <Title />
        {month.map((day) => {
          const isActivate = disablePreviousDay
            ? !isPastDate(day.getDate(), yesterDay)
            : true;
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
            'mx-1 mb-2 w-full font-medium',
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
  const { setDate, closeAction } = useContext(DatepickerContext);
  const selectedDate = new Date(); // TODO: 상위 컴포넌트에서 전달받아야함
  const isSelect = compareDateMatch(date.getDate(), selectedDate, 'ymd');
  const selectAndClose = () => {
    setDate(date.getDate());
    closeAction();
  };
  return (
    <button
      type="button"
      className={cls(
        'm-1 aspect-square w-full cursor-pointer p-1',
        isActivate ? '' : 'pointer-events-none line-through',
        date.isSunday() ? 'sunday' : '',
        date.isSaturday() ? 'saturday' : '',
        date.isThisMonth() ? '' : 'opacity-50',
        date.isToday() ? 'rounded-full bg-blue-400 text-white' : '',
        isSelect ? 'rounded-full ring-2 ring-blue-500' : ''
      )}
      onClick={selectAndClose}
    >
      {date.getDay()}
    </button>
  );
};
