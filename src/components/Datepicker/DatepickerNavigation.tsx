import { useContext } from 'react';
import { ChevronLeft, ChevronRight } from '../../svgs';
import { DatepickerContext } from './DatepickerStore';

export const DatepickerNavigation = () => {
  const { getYearMonth, setNextMonth, setPreviousMonth } =
    useContext(DatepickerContext);

  return (
    <div className="mb-1 flex items-center justify-between pb-3">
      <button
        onClick={setPreviousMonth}
        type="button"
        className="border border-gray-500"
      >
        <ChevronLeft className="stroke-gray-500" />
      </button>
      <div className="text-base font-medium">{getYearMonth()}</div>
      <button
        onClick={setNextMonth}
        type="button"
        className="border border-gray-500"
      >
        <ChevronRight className="stroke-gray-500" />
      </button>
    </div>
  );
};
