import { addDays, getMonth, getWeekOfMonth, subDays } from 'date-fns';
import { setPickedDate, useStore } from '../../../../store';
import { ChevronLeft, ChevronRight } from '../../../../svgs';

const DateController = () => {
  const pickedDate = useStore((state) => state.pickedDate);

  const goPrevWeek = () => {
    setPickedDate(subDays(pickedDate, 7));
  };
  const goAfterWeek = () => {
    setPickedDate(addDays(pickedDate, 7));
  };
  const setToday = () => {
    setPickedDate(new Date());
  };

  const weekNumber = getWeekOfMonth(pickedDate);
  const month = `${getMonth(pickedDate) + 1}`.padStart(2, '0');

  return (
    <div className="flex items-center gap-4">
      <ChevronLeft
        className="rounded-sm border stroke-2"
        iconSize="LG"
        onClick={goPrevWeek}
      />
      <button
        className="w-32 whitespace-nowrap text-3xl font-medium hover:font-bold"
        onClick={setToday}
        type="button"
      >
        {`${month}월 ${weekNumber}주차`}
      </button>
      <ChevronRight
        className="rounded-sm border stroke-2"
        iconSize="LG"
        onClick={goAfterWeek}
      />
    </div>
  );
};

export default DateController;
