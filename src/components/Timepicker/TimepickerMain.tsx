import { useContext } from 'react';
import { TableTime } from '../../models';
import { cls } from '../../utils/common.utils';
import { TimepickerContext } from './TimepickerStore';

export const TimepickerMain = () => {
  const { selectionTime, setHours, setMinutes, closeAction } =
    useContext(TimepickerContext);

  const hours = TableTime.getHours();
  const minutes = TableTime.getMinutes();

  const selectHour = (hour: number) => {
    if (selectionTime.hour === hour) return closeAction();
    setHours(hour);
  };
  const selectMinute = (minute: number) => {
    if (selectionTime.minute === minute) return closeAction();
    setMinutes(minute);
  };

  return (
    <div className="flex h-32 text-center text-sm">
      <Scroll type="hour" numbers={hours} selectAction={selectHour} />
      <Scroll type="minute" numbers={minutes} selectAction={selectMinute} />
    </div>
  );
};

interface ScrollProps {
  type: 'hour' | 'minute';
  numbers: number[];
  selectAction: (number: number) => void;
}

const Scroll = ({ type, numbers, selectAction }: ScrollProps) => {
  const { selectionTime } = useContext(TimepickerContext);

  const title = type === 'hour' ? '시' : '분';

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
