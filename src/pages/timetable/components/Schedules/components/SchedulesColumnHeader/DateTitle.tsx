import { memo, useEffect } from 'react';
import {
  compareDateMatch,
  getStringDay,
  getStringWeekDay,
} from '../../../../../../utils/dateUtils';
import { cls } from '../../../../../../utils/commonUtils';
import { SCROLL_ADDRESS } from '../../../../../../constants/constants';
import type { DateTitleProps } from '../../../../../../types/propsTypes';

const DateTitle = ({ date, isToday, isPickedMonth }: DateTitleProps) => {
  const dayNumber = date.getDay();
  const dayString = getStringDay(date);
  const weekday = getStringWeekDay(date);

  /**
   * table-row의 요소를 불러와 스크롤 조절함
   */
  const moveScroll = () => {
    const el = document.getElementById(SCROLL_ADDRESS + date);
    el?.scrollIntoView({
      block: 'center',
      inline: 'center',
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (isToday) moveScroll();
  }, []);

  return (
    <div
      id={SCROLL_ADDRESS + date}
      className={cls(
        'schedules__date-title',
        isPickedMonth ? '' : 'opacity-50',
        isToday ? 'bg-table-day-strong font-bold text-white' : '',
        dayNumber === 0 ? 'sunday' : '',
        dayNumber === 6 ? 'saturday' : ''
      )}
      onClick={moveScroll}
      onKeyDown={moveScroll}
      role="button"
      tabIndex={0}
    >
      <span>{weekday}</span>
      <span>{dayString}</span>
    </div>
  );
};

export default memo(DateTitle, (prevProps, nextProps) => {
  return (
    compareDateMatch(prevProps.date, nextProps.date, 'ymd') &&
    prevProps.isToday === nextProps.isToday
  );
});
