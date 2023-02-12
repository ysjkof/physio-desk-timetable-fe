import { useStore } from '../../../../store';
import { getHoursByUnit, getMinutesByUnit } from '../../../../utils/date.utils';
import { useTimeDurationOfTimetable } from '../../hooks';
import { Selectbox } from '../../../../components';
import type { FirstAndLastTime } from '../../../../types/common.types';

export const TimeDurationSelector = () => {
  const timeDurationOfTimetable = useStore(
    (state) => state.timeDurationOfTimetable
  );
  const { lastHour, lastMinute, firstHour, firstMinute } =
    timeDurationOfTimetable;

  const startHours = getHoursByUnit(0, 24);
  const endHours = startHours.filter((hour) => hour > firstHour);
  const startMinutes = getMinutesByUnit(10);
  const endMinutes = startMinutes;

  const { changeTimeDuration } = useTimeDurationOfTimetable();

  const changeTableTime = (key: keyof FirstAndLastTime, value: number) => {
    changeTimeDuration(key, value);
  };

  return (
    <div
      id="table-option-selector__view-time"
      className="flex items-center whitespace-nowrap border-b py-1"
    >
      <Selectbox
        selectedValue={`${String(firstHour).padStart(2, '0')}`}
        iconSize={8}
      >
        <Selectbox.Options>
          {startHours.map((hour) => (
            <Selectbox.Option
              key={hour}
              onClick={() => changeTableTime('firstHour', hour)}
            >
              {hour}
            </Selectbox.Option>
          ))}
        </Selectbox.Options>
      </Selectbox>
      <Selectbox
        selectedValue={`${String(firstMinute).padStart(2, '0')}`}
        iconSize={8}
      >
        <Selectbox.Options>
          {startMinutes.map((minute) => (
            <Selectbox.Option
              key={minute}
              onClick={() => changeTableTime('firstMinute', minute)}
            >
              {minute}
            </Selectbox.Option>
          ))}
        </Selectbox.Options>
      </Selectbox>
      ~
      <Selectbox
        selectedValue={`${String(lastHour).padStart(2, '0')}`}
        iconSize={8}
      >
        <Selectbox.Options>
          {endHours.map((hour) => (
            <Selectbox.Option
              key={hour}
              onClick={() => changeTableTime('lastHour', hour)}
            >
              {hour}
            </Selectbox.Option>
          ))}
        </Selectbox.Options>
      </Selectbox>
      <Selectbox
        selectedValue={`${String(lastMinute).padStart(2, '0')}`}
        iconSize={8}
      >
        <Selectbox.Options>
          {endMinutes.map((minute) => (
            <Selectbox.Option
              key={minute}
              onClick={() => changeTableTime('lastMinute', minute)}
            >
              {minute}
            </Selectbox.Option>
          ))}
        </Selectbox.Options>
      </Selectbox>
    </div>
  );
};
