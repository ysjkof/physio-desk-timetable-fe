import { TimeDurationOfTimetable } from '../../../models/TimeDurationOfTimetable';
import { setTimeDurationOfTimetable } from '../../../store';
import type {
  FirstAndLastTime,
  UserIdAndName,
} from '../../../types/common.types';

export const useTimeDurationOfTimetable = () => {
  const initialize = (idAndName: UserIdAndName) => {
    const tableTimeOptions = TimeDurationOfTimetable.initialize(idAndName);
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
