import { memo } from 'react';
import { compareDateMatch } from '../../../../services/dateServices';
import { cls } from '../../../../utils/utils';
import { LOCALE, SCROLL_ADDRESS } from '../../../../constants/constants';

interface DateTitleProps {
  date: Date;
  userLength: number;
  isToday: boolean;
  isSelectedMonth: boolean;
}

function DateTitle({
  userLength,
  date,
  isToday,
  isSelectedMonth,
}: DateTitleProps) {
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
      id={`${SCROLL_ADDRESS + date}`}
      className={cls(
        'DATE-TITLE flex cursor-pointer select-none items-center border-b-4 bg-white hover:bg-gray-200',
        userLength === 1 ? 'border-x-inherit' : '',
        isToday
          ? 'border-b-[#6BA6FF] text-[#6BA6FF]'
          : 'border-b-transparent text-[#9C9FCF]'
      )}
      onClick={moveScroll}
    >
      <div className="flex w-full flex-col items-center justify-center whitespace-nowrap">
        <span className="text-gray-800">{weekday}</span>
        <Day day={dayNumber} isSelectedMonth={isSelectedMonth}>
          {dayString}
        </Day>
      </div>
    </div>
  );
}

function Day({
  children,
  day,
  isSelectedMonth,
}: {
  children: React.ReactNode;
  day: number;
  isSelectedMonth: boolean;
}) {
  return (
    <span
      className={cls(
        'text-xl leading-6',
        day === 0 ? 'sunday' : day === 6 ? 'saturday' : '',
        isSelectedMonth ? '' : 'opacity-50'
      )}
    >
      {children}
    </span>
  );
}

export default memo(DateTitle, (prevProps, nextProps) => {
  return (
    compareDateMatch(prevProps.date, nextProps.date, 'ymd') &&
    prevProps.isToday === nextProps.isToday &&
    prevProps.userLength === nextProps.userLength
  );
});
