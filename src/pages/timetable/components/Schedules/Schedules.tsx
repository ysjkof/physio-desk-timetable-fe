import { ReactNode } from 'react';
import { compareDateMatch } from '../../../../services/dateServices';
import useStore from '../../../../hooks/useStore';
import { getGridTemplateColumns } from '../../../timetableServices';
import DateTitle from './DateTitle';
import ScheduleBox from './ScheduleBox';
import MemberName from './MemberName';
import { TableDisplay } from '../../../../models';
import { cls } from '../../../../utils/utils';
import type { SchedulesProps } from '../../../../types/props.types';

function Schedules({ weekEvents, labels }: SchedulesProps) {
  const today = new Date();

  const userLength = weekEvents[0].users.filter((user) => user.canSee).length;

  const { selectedDate } = useStore();

  const { hasWeekView } = TableDisplay.value;

  const userGridCol = getGridTemplateColumns(userLength);

  const viewPeriodStyle = {
    day: {
      template: {},
      userColumn: {
        gridTemplateColumns: userGridCol,
      },
    },
    week: {
      template: {
        gridTemplateColumns: getGridTemplateColumns(7, userLength * 6),
      },
      userColumn: {
        gridTemplateColumns: userGridCol,
      },
    },
  };

  const containerStyle = hasWeekView
    ? viewPeriodStyle.week.template
    : viewPeriodStyle.day.template;

  const columnStyle = hasWeekView
    ? viewPeriodStyle.week.userColumn
    : viewPeriodStyle.day.userColumn;

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
}

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
