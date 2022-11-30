import { ReactNode } from 'react';
import { useReactiveVar } from '@apollo/client';
import { compareDateMatch } from '../../../../utils/date.utils';
import { SchedulesStyle } from '../../../../styles/timetable.styles';
import DateTitle from './DateTitle';
import ScheduleBox from './ScheduleBox';
import MemberName from './MemberName';
import { TableDisplay } from '../../../../models';
import { cls } from '../../../../utils/common.utils';
import { selectedDateVar } from '../../../../store';
import type { SchedulesProps } from '../../../../types/props.types';

const Schedules = ({ weekEvents, labels }: SchedulesProps) => {
  const today = new Date();
  const selectedDate = useReactiveVar(selectedDateVar);

  const userLength = weekEvents[0].users.filter((user) => user.canSee).length;

  const { hasWeekView } = TableDisplay.value;

  const containerStyle = hasWeekView
    ? SchedulesStyle.week.template(userLength)
    : SchedulesStyle.day.template();

  const columnStyle = hasWeekView
    ? SchedulesStyle.week.userColumn(userLength)
    : SchedulesStyle.day.userColumn(userLength);

  const schedules = hasWeekView
    ? weekEvents
    : weekEvents && [weekEvents[selectedDate.getDay()]];

  return (
    <div
      className="SCHEDULES grid w-full overflow-hidden"
      style={containerStyle}
    >
      {schedules.map((day, i) => {
        const usersOfCanSee = day.users.filter((member) => member.canSee);
        return (
          <div key={i} className="flex flex-col">
            <PaddingWrapper>
              <DateTitle
                date={day.date}
                userLength={userLength}
                isToday={compareDateMatch(today, day.date, 'ymd')}
                isSelectedMonth={compareDateMatch(selectedDate, day.date, 'ym')}
              />
            </PaddingWrapper>
            <PaddingWrapper hasBorder>
              <MemberName
                users={usersOfCanSee}
                viewPeriodStyle={columnStyle}
                userLength={userLength}
              />
            </PaddingWrapper>
            <PaddingWrapper hasBorder>
              <ScheduleBox
                date={day.date}
                labels={labels}
                labelMaxLength={labels.length}
                users={usersOfCanSee}
                viewPeriodStyle={columnStyle}
                userLength={userLength}
                enableTimeIndicator={compareDateMatch(
                  day.date,
                  selectedDate,
                  'ymd'
                )}
              />
            </PaddingWrapper>
          </div>
        );
      })}
    </div>
  );
};

export default Schedules;

function PaddingWrapper({
  children,
  hasBorder,
}: {
  children: ReactNode;
  hasBorder?: boolean;
}) {
  return (
    <div className={cls('px-2', hasBorder ? 'border-r' : '')}>{children}</div>
  );
}
