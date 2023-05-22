import { useContext } from 'react';
import { cls } from '../../../../../../utils/commonUtils';
import { MessagesContext } from '../MessagesContext';
import { type PickedRangeType } from '..';

const PICKED_RANGE_KR = {
  thisWeek: '이번주',
  yesterday: '어제',
  today: '오늘',
  all: '전체',
} as const;

export const MessageFilter = () => {
  const { dateRange, setDateRange } = useContext(MessagesContext);
  const setToday = () => {
    setDateRange('today');
  };
  const setYesterday = () => {
    setDateRange('yesterday');
  };
  const setThisWeek = () => {
    setDateRange('thisWeek');
  };
  const setAll = () => {
    setDateRange('all');
  };

  return (
    <div className="flex py-2 px-2 border-b justify-between">
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
        'rounded-md w-full py-1',
        pickedRange === type ? 'bg-cst-blue text-white' : ''
      )}
      onClick={onClick}
    >
      {PICKED_RANGE_KR[type]}
    </button>
  );
};
