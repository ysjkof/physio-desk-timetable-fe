import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  compareDateMatch,
  getWeeksOfMonth,
} from '../../../../services/dateServices';
import useStore from '../../../../hooks/useStore';
import { cls } from '../../../../utils/utils';
import { selectedDateVar } from '../../../../store';
import { NEXT, PREV } from '../../../../constants/constants';
import BtnArrow from '../../../../_legacy_components/atoms/ButtonArrow';

interface Calendar {
  selectedMonth: { date: Date }[];
  threeMonth: { prev: Date; thisMonth: Date; next: Date };
}

interface NavDatepickerProps {
  variants: any;
}

export default function NavDatepicker({ variants }: NavDatepickerProps) {
  const { selectedDate } = useStore();
  const [calendar, setCalendar] = useState<Calendar>({
    selectedMonth: getWeeksOfMonth(selectedDate),
    threeMonth: getThreeMonth(selectedDate),
  });

  function getThreeMonth(date: Date) {
    const prevMonth = new Date(date);
    const thisMonth = new Date(date);
    const nextMonth = new Date(date);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return { prev: prevMonth, thisMonth, next: nextMonth };
  }

  const onClickChangeMonth = (option: typeof PREV | typeof NEXT) => {
    const months = getWeeksOfMonth(calendar.threeMonth[option]);
    const threeMonth = getThreeMonth(calendar.threeMonth[option]);
    setCalendar({ selectedMonth: months, threeMonth });
  };

  useEffect(() => {
    setCalendar({
      selectedMonth: getWeeksOfMonth(selectedDate),
      threeMonth: getThreeMonth(selectedDate),
    });
  }, [selectedDate]);
  return (
    <motion.div
      className="TABLE_NAV relative flex bg-white px-2 pt-6"
      custom={true}
      variants={variants}
      initial="ini"
      animate="start"
    >
      <span className="position-center-x pointer-events-none absolute -top-1 text-base font-semibold">
        {calendar.selectedMonth[7].date.getMonth() + 1}월
      </span>
      <BtnArrow direction={PREV} onClick={() => onClickChangeMonth(PREV)} />
      <div className="grid w-full grid-cols-7 gap-x-4">
        {calendar.selectedMonth.map((day, i) => (
          <div
            key={i}
            onClick={() => selectedDateVar(day.date)}
            className={cls(
              'btn-menu cursor-pointer py-0.5 text-center',
              day.date.getDay() === 0
                ? 'sunday'
                : day.date.getDay() === 6
                ? 'saturday'
                : '',
              compareDateMatch(day.date, selectedDate, 'ymd')
                ? 'bg-black text-white'
                : ''
            )}
          >
            <span
              className={cls(
                'font-medium',
                compareDateMatch(calendar.selectedMonth[7].date, day.date, 'ym')
                  ? ''
                  : 'opacity-50'
              )}
            >
              {day.date.getDate()}
            </span>
          </div>
        ))}
      </div>
      <BtnArrow direction={NEXT} onClick={() => onClickChangeMonth(NEXT)} />
    </motion.div>
  );
}
