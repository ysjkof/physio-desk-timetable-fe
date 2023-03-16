import { useSchedules } from './useSchedules';
import {
  SchedulesColumnBody,
  SchedulesColumnHeader,
  TimeLabels,
} from './components';
import type { SchedulesProps } from '../../../../types/propsTypes';

const Schedules = ({ weekEvents }: SchedulesProps) => {
  const { schedules, userLength } = useSchedules(weekEvents);

  return (
    <div className="flex h-full w-full overflow-y-scroll">
      <TimeLabels />
      <div>
        <SchedulesColumnHeader userLength={userLength} schedules={schedules} />
        <SchedulesColumnBody userLength={userLength} schedules={schedules} />
      </div>
    </div>
  );
};

export default Schedules;
