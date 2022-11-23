import { compareDateMatch } from '../../../../services/dateServices';
import useStore from '../../../../hooks/useStore';
import { VIEW_PERIOD } from '../../../../constants/constants';
import { getGridTemplateColumns } from '../../../timetableServices';
import DateTitle from './DateTitle';
import ScheduleBox from './ScheduleBox';
import MemberName from './MemberName';
import type { SchedulesProps } from '../../../../types/props.types';
import { ReactNode } from 'react';
import { cls } from '../../../../utils/utils';

function Schedules({ weekEvents, labels, userLength }: SchedulesProps) {
  const today = new Date();

  const { viewOptions, selectedDate } = useStore();

  const labelMaxLength = labels.length;

  const schedules =
    viewOptions.get.viewPeriod === VIEW_PERIOD.ONE_DAY
      ? weekEvents && [weekEvents[selectedDate.getDay()]]
      : weekEvents;

  const userGridCol = getGridTemplateColumns(userLength);

  const viewPeriodStyle = {
    [VIEW_PERIOD.ONE_DAY]: {
      template: {},
      userColumn: {
        gridTemplateColumns: userGridCol,
      },
    },
    [VIEW_PERIOD.ONE_WEEK]: {
      template: {
        gridTemplateColumns: getGridTemplateColumns(7, userLength * 6),
      },
      userColumn: {
        gridTemplateColumns: userGridCol,
      },
    },
  };

  const containerStyle = viewPeriodStyle[viewOptions.get.viewPeriod].template;

  const columnStyle = viewPeriodStyle[viewOptions.get.viewPeriod].userColumn;

  return (
    <div
      className="SCHEDULES grid w-full overflow-hidden"
      style={containerStyle}
    >
      {schedules.map((day, i) => {
        const filteredUsers = day.users.filter((member) => member.isActivate);
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
                users={filteredUsers}
                viewPeriodStyle={columnStyle}
                userLength={userLength}
              />
            </PaddingWrapper>
            <PaddingWrapper hasBorder>
              <ScheduleBox
                date={day.date}
                labels={labels}
                labelMaxLength={labelMaxLength}
                users={filteredUsers}
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
