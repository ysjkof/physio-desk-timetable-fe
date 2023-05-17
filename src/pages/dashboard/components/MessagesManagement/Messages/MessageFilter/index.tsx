import { cls } from '../../../../../../utils/commonUtils';
import { DateRange, PickedRangeType } from '..';

interface MessageFilterProps {
  dateRange: DateRange;
  setDateRange: React.Dispatch<PickedRangeType>;
  clearPatient: () => void;
}

const PICKED_RANGE_KR = {
  thisWeek: '이번주',
  yesterday: '어제',
  today: '오늘',
  all: '전체',
} as const;

export const MessageFilter = ({
  dateRange,
  setDateRange,
  clearPatient,
}: MessageFilterProps) => {
  const setToday = () => {
    setDateRange('today');
    clearPatient();
  };
  const setYesterday = () => {
    setDateRange('yesterday');
    clearPatient();
  };
  const setThisWeek = () => {
    setDateRange('thisWeek');
    clearPatient();
  };
  const setAll = () => {
    setDateRange('all');
    clearPatient();
  };

  return (
    <div className="flex flex-col py-2">
      <FilterButton
        onClick={setToday}
        pickedRange={dateRange.type}
        type={'today'}
      />
      <FilterButton
        onClick={setYesterday}
        pickedRange={dateRange.type}
        type={'yesterday'}
      />
      <FilterButton
        onClick={setThisWeek}
        pickedRange={dateRange.type}
        type={'thisWeek'}
      />
      <FilterButton
        onClick={setAll}
        pickedRange={dateRange.type}
        type={'all'}
      />
    </div>
  );
};

interface FilterButtonProps {
  onClick: () => void;
  pickedRange: PickedRangeType;
  type: PickedRangeType;
}

const FilterButton = ({ onClick, type, pickedRange }: FilterButtonProps) => {
  return (
    <button
      className={cls(
        'mx-2 rounded-md px-6 py-1',
        pickedRange === type ? 'bg-cst-blue text-white' : ''
      )}
      onClick={onClick}
    >
      {PICKED_RANGE_KR[type]}
    </button>
  );
};
