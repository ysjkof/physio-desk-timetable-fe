import { useContext } from 'react';
import { ChevronLeft, ChevronRight } from '../../svgs';
import { DatepickerContext } from './DatepickerStore';

export const DatepickerNavigation = () => {
  const { getYearMonth, setNextMonth, setPreviousMonth } =
    useContext(DatepickerContext);

  return (
    <div className="mb-1 flex items-center justify-between px-4 pb-3">
      <div className="flex items-center gap-4">
        <button
          onClick={setPreviousMonth}
          type="button"
          className="border border-gray-500"
        >
          <ChevronLeft className="stroke-gray-500" />
        </button>
        <button
          onClick={setNextMonth}
          type="button"
          className="border border-gray-500"
        >
          <ChevronRight className="stroke-gray-500" />
        </button>
      </div>
      <div className="text-base font-medium">{getYearMonth()}</div>
    </div>
  );
};
