import { compareDateMatch } from '../../../../../../utils/dateUtils';
import DateTitle from './DateTitle';
import MemberNames from './MemberNames';
import { useStore } from '../../../../../../store';
import PaddingWrapper from '../PaddingWrapper';
import type { SchedulesColumnProps } from '../../../../../../types/propsTypes';

const SchedulesColumnHeader = ({
  schedules,
  userLength,
}: SchedulesColumnProps) => {
  const today = new Date();

  const pickedDate = useStore((state) => state.pickedDate);

  return (
    <div id="schedules__column-header">
      {schedules.map((day, i) => {
        return (
          <div key={i} className="schedules__column">
            <PaddingWrapper>
              <DateTitle
                date={day.date}
                userLength={userLength}
                isToday={compareDateMatch(today, day.date, 'ymd')}
                isPickedMonth={compareDateMatch(pickedDate, day.date, 'ym')}
              />
            </PaddingWrapper>
            {day.members.length === 0 ? (
              <p className="text-center">멤버가 없습니다</p>
            ) : (
              <PaddingWrapper hasBorder>
                <MemberNames members={day.members} userLength={userLength} />
              </PaddingWrapper>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SchedulesColumnHeader;
