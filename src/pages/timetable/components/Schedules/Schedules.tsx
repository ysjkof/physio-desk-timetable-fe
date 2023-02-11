import { ReactNode } from 'react';
import { useReactiveVar } from '@apollo/client';
import { compareDateMatch } from '../../../../utils/date.utils';
import { SchedulesStyle } from '../../../../styles/timetable.styles';
import DateTitle from './DateTitle';
import ScheduleBox from './ScheduleBox';
import MemberName from './MemberName';
import { cls } from '../../../../utils/common.utils';
import { selectedDateVar, tableDisplayVar } from '../../../../store';
import type { SchedulesProps } from '../../../../types/props.types';

const Schedules = ({ weekEvents, labels }: SchedulesProps) => {
  const today = new Date();

  const userLength = weekEvents[0].users.filter((user) => user.canSee).length;

  const { hasWeekView } = useReactiveVar(tableDisplayVar);

  const containerStyle = hasWeekView
    ? SchedulesStyle.week.template(userLength)
    : SchedulesStyle.day.template();

  const columnStyle = hasWeekView
    ? SchedulesStyle.week.userColumn(userLength)
    : SchedulesStyle.day.userColumn(userLength);

  const selectedDate = useReactiveVar(selectedDateVar);

  const schedules = hasWeekView
    ? weekEvents
    : weekEvents && [weekEvents[selectedDate.getDay()]];

  return (
    <div className="SCHEDULES grid" style={containerStyle}>
      {schedules.map((day, i) => {
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
                users={day.users}
                viewPeriodStyle={columnStyle}
                userLength={userLength}
              />
            </PaddingWrapper>
            <PaddingWrapper hasBorder>
              <ScheduleBox
                date={day.date}
                labels={labels}
                labelMaxLength={labels.length}
                users={day.users}
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
