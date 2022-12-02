import { memo } from 'react';
import { compareDateMatch } from '../../../../utils/date.utils';
import { cls } from '../../../../utils/common.utils';
import { LOCALE, SCROLL_ADDRESS } from '../../../../constants/constants';
import type { DateTitleProps } from '../../../../types/props.types';

const DateTitle = ({
  userLength,
  date,
  isToday,
  isSelectedMonth,
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
        'DATE-TITLE mb-1 flex cursor-pointer select-none items-center bg-white hover:bg-gray-200',
        userLength === 1 ? 'border-x-inherit' : '',
        isToday ? 'bg-table-day-strong text-white' : 'bg-table-day-light',
        isSelectedMonth ? '' : 'opacity-50'
      )}
      onClick={moveScroll}
      onKeyDown={moveScroll}
      role="button"
      tabIndex={0}
    >
      <div className="flex w-full items-center justify-center gap-2 whitespace-nowrap py-0.5 text-base font-medium">
        <span
          className={cls(
            isToday ? 'text-white' : 'text-table-day-color',
            dayNumber === 0 ? 'sunday' : '',
            dayNumber === 6 ? 'saturday' : ''
          )}
        >
          {weekday}
        </span>
        <span className={cls(isToday ? 'text-white' : 'text-table-day-strong')}>
          {dayString}
        </span>
      </div>
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
