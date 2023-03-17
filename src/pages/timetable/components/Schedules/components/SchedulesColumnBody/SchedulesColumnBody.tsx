import { compareDateMatch } from '../../../../../../utils/dateUtils';
import ScheduleBox from './ScheduleBox';
import { useStore } from '../../../../../../store';
import { useTableLabel } from '../../../../hooks';
import PaddingWrapper from '../PaddingWrapper';
import type { SchedulesColumnProps } from '../../../../../../types/propsTypes';

const SchedulesColumnBody = ({
  schedules,
  userLength,
}: SchedulesColumnProps) => {
  const pickedDate = useStore((state) => state.pickedDate);

  const { labels } = useTableLabel();

  return (
    <div id="schedules__column-body">
      {schedules.map((day, i) => {
        return (
          <div key={i} className="schedules__column">
            <PaddingWrapper hasBorder>
              {day.members.length === 0 ? (
                <p className="break-keep text-center">
                  선택한 날짜를 확인하세요
                </p>
              ) : (
                <ScheduleBox
                  date={day.date}
                  labels={labels}
                  labelMaxLength={labels.length}
                  members={day.members}
                  userLength={userLength}
                  enableTimeIndicator={compareDateMatch(
                    day.date,
                    pickedDate,
                    'ymd'
                  )}
                />
              )}
            </PaddingWrapper>
          </div>
        );
      })}
    </div>
  );
};

export default SchedulesColumnBody;
