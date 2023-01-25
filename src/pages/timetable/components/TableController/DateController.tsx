import { useReactiveVar } from '@apollo/client';
import { addDays, getMonth, getWeekOfMonth, subDays } from 'date-fns';
import { selectedDateVar } from '../../../../store';
import { ChevronLeft, ChevronRight } from '../../../../svgs';

const DateController = () => {
  const selectedDate = useReactiveVar(selectedDateVar);
  const today = new Date();

  const handleDateNavMovePrev = () => {
    selectedDateVar(subDays(selectedDate, 7));
  };
  const handleDateNavMoveNext = () => {
    selectedDateVar(addDays(selectedDate, 7));
  };

  const weekNumber = getWeekOfMonth(selectedDate);
  const month = `${getMonth(selectedDate) + 1}`.padStart(2, '0');

  return (
    <div className="flex items-center gap-4">
      <ChevronLeft
        className="rounded-sm border stroke-2"
        iconSize="LG"
        onClick={handleDateNavMovePrev}
      />
      <button
        className="w-32 whitespace-nowrap text-3xl font-medium hover:font-bold"
        onClick={() => selectedDateVar(today)}
        type="button"
      >
        {`${month}월 ${weekNumber}주차`}
      </button>
      <ChevronRight
        className="rounded-sm border stroke-2"
        iconSize="LG"
        onClick={handleDateNavMoveNext}
      />
    </div>
  );
};

export default DateController;
