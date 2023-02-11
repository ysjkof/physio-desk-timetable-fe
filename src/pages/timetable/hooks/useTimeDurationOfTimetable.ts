import { useMe } from '../../../hooks';
import { TimeDurationOfTimetable } from '../../../models/TimeDurationOfTimetable';
import { setTimeDurationOfTimetable } from '../../../store';
import type { FirstAndLastTime } from '../../../types/common.types';

export const useTimeDurationOfTimetable = () => {
  const [, { getIdName }] = useMe();

  const initialize = () => {
    const tableTimeOptions = TimeDurationOfTimetable.initialize(getIdName());
    setTimeDurationOfTimetable(tableTimeOptions);
  };

  const changeTimeDuration = (key: keyof FirstAndLastTime, value: number) => {
    const options = TimeDurationOfTimetable.createTimeOptions(key, value);
    TimeDurationOfTimetable.set(options);
    TimeDurationOfTimetable.saveToLocalStorage(options);
    setTimeDurationOfTimetable(options);
  };

  return { initialize, changeTimeDuration };
};
