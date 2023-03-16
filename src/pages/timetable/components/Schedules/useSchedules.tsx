import { useStore } from '../../../../store';
import type { ISchedules } from '../../../../types/commonTypes';

export const useSchedules = (weekEvents: ISchedules[]) => {
  const hiddenUsers = useStore((state) => state.hiddenUsers);

  const isShowUser = (memberId: number) => {
    return !hiddenUsers.has(memberId);
  };

  const userLength = weekEvents.reduce(
    (acc, cur) =>
      Math.max(
        acc,
        cur.members.filter((member) => isShowUser(member.id)).length
      ),
    1
  );

  const isWeekCalendar = useStore((state) => state.isWeekCalendar);

  const pickedDate = useStore((state) => state.pickedDate);

  const schedules = isWeekCalendar
    ? weekEvents
    : weekEvents && [weekEvents[pickedDate.getDay()]];

  return {
    userLength,
    schedules,
  };
};
