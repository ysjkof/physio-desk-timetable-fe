import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useReducer, useRef, useState } from 'react';
import useStore from '../../hooks/useStore';
import { compareDateMatch } from '../../services/dateServices';
import { cls, getPositionRef } from '../../utils/utils';
import { ModalPortal } from '../templates/ModalPortal';
import { DatepickerInputState, HasDateOption } from './DatepickerWithInput';

interface DatePickerInterface extends HasDateOption, DatepickerInputState {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Datepicker = ({
  inputDate,
  setInputDate,
  isOpen,
  setOpen,
  hasHour,
}: DatePickerInterface) => {
  const { viewOptions } = useStore();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);

  const changeShowMonthReducer = (
    state: Date[],
    action: 'increment' | 'decrement' | 'thisMonth'
  ) => {
    const newDate = new Date(state[15]);
    switch (action) {
      case 'increment':
        newDate.setMonth(newDate.getMonth() + 1);
        return getWeeksOfMonth(newDate);
      case 'decrement':
        newDate.setMonth(newDate.getMonth() - 1);
        return getWeeksOfMonth(newDate);
      case 'thisMonth':
        return getWeeksOfMonth(new Date());

      default:
        throw new Error('일어날 수 없는 일 입니다');
    }
  };

  const [showMonthCalendar, changeShowMonth] = useReducer(
    changeShowMonthReducer,
    getWeeksOfMonth(new Date())
  );

  const ref = useRef<HTMLDivElement>(null);
  const { top, left } = getPositionRef(ref, 2);

  function getWeeks(value: Date, option?: 'sunday') {
    let result: Date[] = [];
    const date = new Date(value);
    const day = date.getDay();
    const sunday = new Date(date.setDate(date.getDate() - day));
    if (option === 'sunday') {
      return result.concat(sunday);
    }
    for (let i = 0; i < 7; i++) {
      const aDay = new Date(sunday);
      aDay.setDate(sunday.getDate() + i);
      result.push(aDay);
    }
    return result;
  }

  function getWeeksOfMonth(value: Date) {
    let result = [];
    const firstDate = new Date(value);
    const lastDate = new Date(firstDate);
    firstDate.setDate(1);
    lastDate.setMonth(lastDate.getMonth() + 1);
    lastDate.setDate(0);
    for (let i = 0; i < 5; i++) {
      const date = new Date(firstDate);
      date.setDate(i * 7 + 1);
      const week = getWeeks(date);
      result.push(...week);
    }
    return result;
  }

  function getHours(start: number, end: number) {
    const hours = [];
    let i = start;
    while (i < end) {
      hours.push(i);
      i++;
    }
    return hours;
  }

  function getMinutes(minutesUnit: number) {
    const minutes = [];
    let i = 0;
    while (i < 60) {
      minutes.push(i);
      i = i + minutesUnit;
    }
    return minutes;
  }

  const listOfHours = getHours(
    viewOptions.get.tableDuration.start.hours,
    viewOptions.get.tableDuration.end.hours
  );

  const minutesUnit = 10; // 선택 가능한 분의 최소 단위. 10일 경우 10, 20, 30, 40, 50 분만 선택 가능
  const listOfMinutes = getMinutes(minutesUnit);

  const selectDay = (date: Date) => {
    const { year, month, day } = inputDate;
    const isSame =
      +year === date.getFullYear() &&
      +month === date.getMonth() + 1 &&
      +day === date.getDate();
    if (isSame) return;
    setInputDate((prevState) => ({
      ...prevState,
      year: '' + date.getFullYear(),
      month: '' + (date.getMonth() + 1),
      day: '' + date.getDate(),
    }));
    setSelectedDate(date);
  };

  const invokeSelectHour = (hour: string) => {
    if (inputDate.hour === hour) return;
    setInputDate((prevDate) => {
      return { ...prevDate, hour };
    });
  };
  const invokeSelectMinute = (minute: string) => {
    if (inputDate.minute === minute) return;
    setInputDate((prevDate) => {
      return { ...prevDate, minute };
    });
  };

  const displayedYearMonth = `${showMonthCalendar[15].getFullYear()}년 ${
    showMonthCalendar[15].getMonth() + 1
  }월`;

  return (
    <div className="datepicker-icon relative">
      <div
        onClick={() => setOpen((current) => !current)}
        className="cursor-pointer"
        ref={ref}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      {isOpen && (
        <ModalPortal
          left={left}
          top={top}
          closeAction={() => setOpen}
          children={
            <div className="absolute bottom-0 z-50 w-[440px]">
              <div className="absolute flex w-full flex-col rounded-md border bg-white p-3">
                <div className="datepicker-navigation mb-1 flex justify-between border-b pb-2">
                  <div>{displayedYearMonth}</div>
                  <div className="space-x-6">
                    <span
                      onClick={() => {
                        changeShowMonth('decrement');
                      }}
                      className="cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faArrowUp} />
                    </span>
                    <span
                      onClick={() => {
                        changeShowMonth('increment');
                      }}
                      className="cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faArrowDown} />
                    </span>
                    <span
                      className="cursor-pointer"
                      onClick={() => {
                        changeShowMonth('thisMonth');
                      }}
                    >
                      오늘
                    </span>
                    <span
                      className="cursor-pointer"
                      onClick={() => setOpen(false)}
                    >
                      닫기
                    </span>
                  </div>
                </div>
                <div className="datepicker-calendar flex divide-x">
                  <div className="datepicker-calendar-col left grid w-full grid-cols-7 pr-1.5 text-center">
                    {['일', '월', '화', '수', '목', '금', '토'].map(
                      (day, i) => (
                        <div key={i}>{day}</div>
                      )
                    )}
                    {showMonthCalendar.map((day) => (
                      <span
                        key={day.valueOf()}
                        className={cls(
                          'cursor-pointer px-1.5 py-1',
                          day.getMonth() !== showMonthCalendar[15].getMonth()
                            ? 'opacity-50'
                            : '',
                          day.getDay() === 0
                            ? 'sunday'
                            : day.getDay() === 6
                            ? 'saturday'
                            : '',
                          compareDateMatch(day, today, 'ymd')
                            ? 'rounded-md border border-transparent ring-2 ring-red-500'
                            : '',
                          compareDateMatch(day, selectedDate, 'ymd')
                            ? 'rounded-md bg-red-400 text-white'
                            : ''
                        )}
                        onClick={() => selectDay(day)}
                      >
                        {day.getDate()}
                      </span>
                    ))}
                  </div>
                  {hasHour && (
                    <div className="datepicker-calendar-col-time-picker flex h-32 space-x-2 pl-2 text-center">
                      <div className="hours-picker hidden-scrollbar flex flex-col overflow-y-scroll">
                        <span>시</span>
                        {listOfHours.map((hours, i) => (
                          <span
                            key={i}
                            className={`cursor-pointer px-1.5 ${
                              +inputDate.hour === hours
                                ? 'rounded-md bg-blue-500 text-white'
                                : ''
                            }`}
                            onClick={() => invokeSelectHour('' + hours)}
                          >
                            {('' + hours).padStart(2, '0')}
                          </span>
                        ))}
                      </div>
                      <div className="MINUTE_PICKER hidden-scrollbar flex flex-col overflow-y-scroll">
                        <span>분</span>
                        {listOfMinutes.map((minute, i) => (
                          <span
                            key={i}
                            className={`cursor-pointer px-1.5 ${
                              +inputDate.minute === minute
                                ? 'rounded-md bg-blue-500 text-white'
                                : ''
                            }`}
                            onClick={() => invokeSelectMinute('' + minute)}
                          >
                            {('' + minute).padStart(2, '0')}
                          </span>
                        ))}
                      </div>
                      {/* <div className="flex flex-col whitespace-nowrap">
                        <span className="">오전</span>
                        <span className="">오후</span>
                      </div> */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};
