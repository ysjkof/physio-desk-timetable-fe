import { getActiveUserLength } from '..';
import { compareDateMatch } from '../../../services/dateServices';
import { cls } from '../../../utils/utils';
import { TableLoopTemplate } from '../templates/TableLoopTemplate';
import { TimeIndicatorBar } from './TimeIndicatorBar';
import { DayWithUsers } from '../../../types/type';
import useStore from '../../../hooks/useStore';
import ReservationButtons from '../molecules/ReservationButtons';
import ScheduleInUserInDay from '../molecules/ScheduleInUserInDay';
import { VIEW_PERIOD } from '../../../constants/constants';

interface SchedulesProps {
  weekEvents: DayWithUsers[];
  labels: string[];
}
function Schedules({ weekEvents, labels }: SchedulesProps) {
  const { selectedInfo, viewOptions, selectedDate } = useStore();

  const userLength = getActiveUserLength(selectedInfo.clinic?.members);
  const labelMaxLength = labels.length;

  const schedules =
    viewOptions.viewPeriod === VIEW_PERIOD.ONE_DAY
      ? weekEvents && [weekEvents[selectedDate.getDay()]]
      : weekEvents;

  return (
    <TableLoopTemplate
      elementName="TABLE_COLS"
      userLength={userLength}
      children={schedules.map((day, i) => (
        <div
          key={i}
          className={cls(
            'user-cols-divide relative grid border-b',
            userLength === 1 ? 'border-x-inherit' : ''
          )}
          style={{
            gridTemplateColumns: `repeat(${userLength}, 1fr)`,
          }}
        >
          <TimeIndicatorBar
            isActive={compareDateMatch(day.date, selectedDate, 'ymd')}
          />
          {day.users.map((member, userIndex) => {
            return member.isActivate ? (
              <div
                key={member.id}
                className="USER_COL relative w-full border-r-[0.5px] last:border-r-0 hover:border-transparent hover:bg-gray-200/50"
              >
                <ReservationButtons
                  labelMaxLength={labelMaxLength}
                  date={day.date}
                  labels={labels}
                  userId={member.user.id}
                  userIndex={userIndex}
                />
                <ScheduleInUserInDay
                  labelMaxLength={labelMaxLength}
                  labels={labels}
                  events={member.events}
                  userIndex={userIndex}
                />
              </div>
            ) : (
              ''
            );
          })}
        </div>
      ))}
    />
  );
}

export default Schedules;
