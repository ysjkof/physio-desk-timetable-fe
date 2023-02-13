import { ReactNode } from 'react';
import { setTimeDurationOfTimetable, useStore } from '../../../../store';
import { getHoursByUnit, getMinutesByUnit } from '../../../../utils/date.utils';
import { cls } from '../../../../utils/common.utils';
import { TimeDurationOfTimetable } from '../../../../models';
import type { FirstAndLastTime } from '../../../../types/common.types';

export const TimeDurationSelector = () => {
  const { lastHour, lastMinute, firstHour, firstMinute } = useStore(
    (state) => state.timeDurationOfTimetable
  );

  const hours = getHoursByUnit(0, 24);
  const minutes = getMinutesByUnit(10);

  const changeTimeDuration = (key: keyof FirstAndLastTime, value: number) => {
    const options = TimeDurationOfTimetable.createTimeOptions(key, value);
    TimeDurationOfTimetable.set(options);
    TimeDurationOfTimetable.saveToLocalStorage(options);
    setTimeDurationOfTimetable(options);
  };

  const changeTableTime = (key: keyof FirstAndLastTime, value: number) => {
    changeTimeDuration(key, value);
  };

  return (
    <div className="flex whitespace-nowrap">
      <ColWrapper label="시작">
        <TimeWrapper label="시간">
          {hours.map((hour) => (
            <button
              type="button"
              key={hour}
              onClick={
                hour < lastHour
                  ? () => changeTableTime('firstHour', hour)
                  : undefined
              }
              className={cls(
                'py-1',
                firstHour === hour ? 'bg-[#6BA6FF] font-bold text-white' : '',
                hour >= lastHour
                  ? 'pointer-events-none bg-gray-100 text-gray-400'
                  : ''
              )}
            >
              {hour}
            </button>
          ))}
        </TimeWrapper>
        <TimeWrapper label="분">
          {minutes.map((minute) => (
            <button
              type="button"
              key={minute}
              onClick={() => changeTableTime('firstMinute', minute)}
              className={cls(
                'py-1',
                firstMinute === minute
                  ? 'bg-[#6BA6FF] font-bold text-white'
                  : ''
              )}
            >
              {minute}
            </button>
          ))}
        </TimeWrapper>
      </ColWrapper>
      <ColWrapper label="종료">
        <TimeWrapper label="시간">
          {hours.map((hour) => (
            <button
              type="button"
              key={hour}
              onClick={
                hour > firstHour
                  ? () => changeTableTime('lastHour', hour)
                  : undefined
              }
              className={cls(
                'py-1',
                hour === lastHour ? 'bg-[#6BA6FF] font-bold text-white' : '',
                hour <= firstHour
                  ? 'pointer-events-none bg-gray-100 text-gray-400'
                  : ''
              )}
            >
              {hour}
            </button>
          ))}
        </TimeWrapper>
        <TimeWrapper label="분">
          {minutes.map((minute) => (
            <button
              type="button"
              key={minute}
              onClick={() => changeTableTime('lastMinute', minute)}
              className={cls(
                'py-1',
                lastMinute === minute ? 'bg-[#6BA6FF] font-bold text-white' : ''
              )}
            >
              {minute}
            </button>
          ))}
        </TimeWrapper>
      </ColWrapper>
    </div>
  );
};

const ColWrapper = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  return (
    <div className="flex w-full flex-col border-r last:border-0">
      <span className="border-b text-center">{label}</span>
      <div className="flex divide-x">{children}</div>
    </div>
  );
};
const TimeWrapper = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  return (
    <div className="flex w-full flex-col">
      <span className="border-b text-center">{label}</span>
      {children}
    </div>
  );
};
