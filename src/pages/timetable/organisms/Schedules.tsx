import { getActiveUserLength } from '..';
import {
  addHourToDate,
  compareDateMatch,
} from '../../../services/dateServices';
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
  labels: Date[];
}
function Schedules({ weekEvents, labels }: SchedulesProps) {
  const { selectedInfo, viewOptions } = useStore();

  const userLength = getActiveUserLength(selectedInfo.clinic?.members);
  const labelMaxLength = labels.length;

  const schedules =
    viewOptions.viewPeriod === VIEW_PERIOD.ONE_DAY
      ? weekEvents && [weekEvents[selectedInfo.date.getDay()]]
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
            isActive={compareDateMatch(day.date, selectedInfo.date, 'ymd')}
            labels={labels}
          />
          {day.users.map((member, userIndex) => {
            // 유저마다 내부의 버튼과 이벤트에서 combineDateAndHours를 한다면 user 수만큼 반복 작업을 함.
            // 그래서 여기로 뺌
            const dayLabels = labels.map((label) =>
              addHourToDate(day.date, label).toISOString()
            );
            return member.isActivate ? (
              <div
                key={member.id}
                className="USER_COL relative w-full border-r-[0.5px] last:border-r-0 hover:border-transparent hover:bg-gray-200/50"
              >
                <ReservationButtons
                  labelMaxLength={labelMaxLength}
                  labels={dayLabels}
                  userId={member.user.id}
                  userIndex={userIndex}
                />
                <ScheduleInUserInDay
                  labelMaxLength={labelMaxLength}
                  labels={dayLabels}
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
