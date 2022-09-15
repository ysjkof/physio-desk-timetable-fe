import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { compareDateMatch } from '../../../../services/dateServices';
import { cls } from '../../../../utils/utils';
import { SCROLL_ADRESS } from '../../../../constants/constants';
import BtnDatecheck from '../../../../components/atoms/ButtonDatecheck';
import useStore from '../../../../hooks/useStore';
import { memo } from 'react';
import { selectedDateVar } from '../../../../store';

interface DateTitleProps {
  date: Date;
  userLength: number;
  isToday: boolean;
}
function DateTitle({ date, isToday, userLength }: DateTitleProps) {
  const { selectedDate } = useStore();
  const selectedMonth = compareDateMatch(selectedDate, date, 'ym');
  const selectedDay = compareDateMatch(selectedDate, date, 'ymd');

  return (
    <div
      className={cls(
        'DateTitle user-cols-divide relative flex cursor-pointer items-center border-b bg-white py-1 hover:bg-gray-200',
        userLength === 1 ? 'border-x-inherit' : ''
      )}
      id={`${SCROLL_ADRESS + date}`}
      onClick={() => {
        // table-row의 요소를 불러와 스크롤 조절함
        const el = document.getElementById(SCROLL_ADRESS + date);
        el?.scrollIntoView({
          block: 'center',
          inline: 'center',
          behavior: 'smooth',
        });
        selectedDateVar(date);
      }}
    >
      <div className="mx-auto whitespace-nowrap">
        <BtnDatecheck
          text={date.toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric',
            weekday: 'short',
          })}
          day={date.getDay()}
          selectedMonth={selectedMonth}
          selectedDay={selectedDay}
          isSubheader
        />
        {isToday && (
          <FontAwesomeIcon
            icon={faSun}
            fontSize={12}
            className="text-red-500"
          />
        )}
        {selectedDay && (
          <FontAwesomeIcon
            icon={faCheckCircle}
            fontSize={12}
            className="pl-0.5 text-green-500"
          />
        )}
      </div>
    </div>
  );
}

export default memo(DateTitle, (prevProps, nextProps) => {
  return (
    compareDateMatch(prevProps.date, nextProps.date, 'ymd') &&
    prevProps.isToday === nextProps.isToday &&
    prevProps.userLength === nextProps.userLength
  );
});
