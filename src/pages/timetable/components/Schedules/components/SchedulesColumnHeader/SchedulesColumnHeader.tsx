import { compareDateMatch } from '../../../../../../utils/dateUtils';
import DateTitle from './DateTitle';
import MemberNames from './MemberNames';
import { useStore } from '../../../../../../store';
import PaddingWrapper from '../PaddingWrapper';
import type { SchedulesColumnHeaderProps } from '../../../../../../types/propsTypes';

const SchedulesColumnHeader = ({ schedules }: SchedulesColumnHeaderProps) => {
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
                isToday={compareDateMatch(today, day.date, 'ymd')}
                isPickedMonth={compareDateMatch(pickedDate, day.date, 'ym')}
              />
            </PaddingWrapper>
            <PaddingWrapper hasBorder>
              {day.members.length === 0 ? (
                <div className="schedules__member-name-title">
                  <p className="schedules__member-name-item break-keep text-center">
                    정보가 없습니다
                  </p>
                </div>
              ) : (
                <MemberNames members={day.members} />
              )}
            </PaddingWrapper>
          </div>
        );
      })}
    </div>
  );
};

export default SchedulesColumnHeader;
