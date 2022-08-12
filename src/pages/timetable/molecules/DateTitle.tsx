import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { compareDateMatch } from '../../../services/dateServices';
import { cls } from '../../../utils/utils';
import { SCROLL_ADRESS } from '../../../constants/constants';
import { BtnDatecheck } from '../../../components/atoms/ButtonDatecheck';
import useStore from '../../../hooks/useStore';

interface DateTitleProps {
  date: Date;
  userLength: number;
}
export function DateTitle({ date, userLength }: DateTitleProps) {
  const { selectedInfo, setSelectedInfo, today } = useStore();
  const selectedMonth = compareDateMatch(selectedInfo.date, date, 'ym');
  const selectedDay = compareDateMatch(selectedInfo.date, date, 'ymd');
  const isToday = compareDateMatch(today, date, 'ymd');

  return (
    <div
      className={cls(
        'user-cols-divide relative flex cursor-pointer items-center border-b bg-white py-1 hover:bg-gray-200',
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
        setSelectedInfo('date', date);
      }}
    >
      <div className="mx-auto">
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
            fontSize={14}
            // className="absolute left-5 top-0.5 pr-1 text-red-500"
            className=" pr-1 text-red-500"
          />
        )}
        {selectedDay && (
          <FontAwesomeIcon
            icon={faCheckCircle}
            fontSize={14}
            className="pl-1 text-green-500"
            // className="absolute left-8 top-0.5 pl-1 text-green-500"
          />
        )}
      </div>
    </div>
  );
}
