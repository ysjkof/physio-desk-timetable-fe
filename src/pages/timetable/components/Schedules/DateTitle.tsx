import { memo } from 'react';
import { compareDateMatch } from '../../../../utils/dateUtils';
import { cls } from '../../../../utils/commonUtils';
import { LOCALE, SCROLL_ADDRESS } from '../../../../constants/constants';
import type { DateTitleProps } from '../../../../types/propsTypes';

const DateTitle = ({
  userLength,
  date,
  isToday,
  isPickedMonth,
}: DateTitleProps) => {
  const dayNumber = date.getDay();
  const dayString = new Intl.DateTimeFormat(LOCALE, { day: 'numeric' }).format(
    date
  );
  const weekday = new Intl.DateTimeFormat(LOCALE, { weekday: 'long' }).format(
    date
  );

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

  return (
    <div
      id={SCROLL_ADDRESS + date}
      className={cls(
        'timetable-date-title cursor-pointer hover:bg-gray-200',
        userLength === 1 ? 'border-x-inherit' : '',
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
    prevProps.isToday === nextProps.isToday &&
    prevProps.userLength === nextProps.userLength
  );
});
