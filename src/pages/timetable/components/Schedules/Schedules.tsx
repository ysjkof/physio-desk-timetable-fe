import { ReactNode } from 'react';
import { compareDateMatch } from '../../../../utils/dateUtils';
import DateTitle from './DateTitle';
import ScheduleBox from './ScheduleBox';
import MemberName from './MemberName';
import { cls } from '../../../../utils/commonUtils';
import { useStore } from '../../../../store';
import EventList from './EventList';
import type { SchedulesProps } from '../../../../types/propsTypes';

const Schedules = ({ weekEvents, labels }: SchedulesProps) => {
  const today = new Date();

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

  const containerStyle = isWeekCalendar
    ? undefined
    : { maxWidth: 'calc(100% - 24rem)' };

  return (
    <div className="flex">
      {schedules.map((day, i) => {
        return (
          <div key={i} className="schedules__column" style={containerStyle}>
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
              <>
                <PaddingWrapper hasBorder>
                  <MemberName members={day.members} userLength={userLength} />
                </PaddingWrapper>
                <PaddingWrapper hasBorder>
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
                </PaddingWrapper>
              </>
            )}
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
