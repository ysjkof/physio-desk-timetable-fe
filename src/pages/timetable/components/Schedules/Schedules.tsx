import { ReactNode } from 'react';
import { compareDateMatch } from '../../../../utils/date.utils';
import { SchedulesStyle } from '../../../../styles/timetable.styles';
import DateTitle from './DateTitle';
import ScheduleBox from './ScheduleBox';
import MemberName from './MemberName';
import { cls } from '../../../../utils/common.utils';
import { useStore } from '../../../../store';
import EventList from './EventList';
import type { SchedulesProps } from '../../../../types/props.types';

const Schedules = ({ weekEvents, labels }: SchedulesProps) => {
  const today = new Date();

  const hiddenUsers = useStore((state) => state.hiddenUsers);

  const isShowUser = (memberId: number) => {
    return !hiddenUsers.has(memberId);
  };

  const userLength = weekEvents[0].members.filter((member) =>
    isShowUser(member.id)
  ).length;

  const isWeekCalendar = useStore((state) => state.isWeekCalendar);

  const containerStyle = isWeekCalendar
    ? SchedulesStyle.week.template(userLength)
    : SchedulesStyle.day.template();

  const columnStyle = isWeekCalendar
    ? SchedulesStyle.week.userColumn(userLength)
    : SchedulesStyle.day.userColumn(userLength);

  const pickedDate = useStore((state) => state.pickedDate);

  const schedules = isWeekCalendar
    ? weekEvents
    : weekEvents && [weekEvents[pickedDate.getDay()]];

  return (
    <div className="grid" style={containerStyle}>
      {schedules.map((day, i) => {
        return (
          <div key={i} className="flex flex-col">
            <PaddingWrapper>
              <DateTitle
                date={day.date}
                userLength={userLength}
                isToday={compareDateMatch(today, day.date, 'ymd')}
                isPickedMonth={compareDateMatch(pickedDate, day.date, 'ym')}
              />
            </PaddingWrapper>
            <PaddingWrapper hasBorder>
              <MemberName
                members={day.members}
                viewPeriodStyle={columnStyle}
                userLength={userLength}
              />
            </PaddingWrapper>
            <PaddingWrapper hasBorder>
              <ScheduleBox
                date={day.date}
                labels={labels}
                labelMaxLength={labels.length}
                members={day.members}
                viewPeriodStyle={columnStyle}
                userLength={userLength}
                enableTimeIndicator={compareDateMatch(
                  day.date,
                  pickedDate,
                  'ymd'
                )}
              />
            </PaddingWrapper>
          </div>
        );
      })}
      {!isWeekCalendar && <EventList events={schedules[0]} />}
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
