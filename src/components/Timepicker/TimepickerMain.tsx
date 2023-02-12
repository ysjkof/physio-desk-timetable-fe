import { useContext } from 'react';
import { TimeDurationOfTimetable } from '../../models';
import { cls } from '../../utils/common.utils';
import { TimepickerContext } from './TimepickerStore';

export const TimepickerMain = () => {
  const { selectionTime, setHours, setMinutes, closeAction } =
    useContext(TimepickerContext);

  const hours = TimeDurationOfTimetable.getHours();
  const minutes = TimeDurationOfTimetable.getMinutes();

  const selectHour = (hours: number) => {
    if (selectionTime.hours === hours) return closeAction();
    setHours(hours);
  };
  const selectMinute = (minutes: number) => {
    if (selectionTime.minutes === minutes) return closeAction();
    setMinutes(minutes);
  };

  return (
    <div className="flex h-32 text-center text-sm">
      <Scroll type="hours" numbers={hours} selectAction={selectHour} />
      <Scroll type="minutes" numbers={minutes} selectAction={selectMinute} />
    </div>
  );
};

interface ScrollProps {
  type: 'hours' | 'minutes';
  numbers: number[];
  selectAction: (number: number) => void;
}

const Scroll = ({ type, numbers, selectAction }: ScrollProps) => {
  const { selectionTime } = useContext(TimepickerContext);

  const title = type === 'hours' ? '시' : '분';

  return (
    <div className="hidden-scrollbar flex flex-col overflow-y-scroll">
      <span className="sticky top-0 border-b bg-white">{title}</span>
      {numbers.map((number) => (
        <button
          type="button"
          key={`time-selector-hours-${number}`}
          className={cls(
            'cursor-pointer px-4',
            selectionTime[type] === number ? 'bg-blue-500 text-white' : ''
          )}
          onClick={() => selectAction(number)}
        >
          {`${number}`.padStart(2, '0')}
        </button>
      ))}
    </div>
  );
};
