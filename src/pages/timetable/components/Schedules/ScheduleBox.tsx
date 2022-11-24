import { cls } from '../../../../utils/utils';
import TimeIndicatorBar from '../../_legacy_components/organisms/TimeIndicatorBar';
import ReservationButtons from './ReserveButtons';
import EventBoxContainer from './EventBoxContainer';
import type { ScheduleBoxProps } from '../../../../types/props.types';

function ScheduleBox({
  userLength,
  enableTimeIndicator,
  viewPeriodStyle,
  users,
  date,
  labelMaxLength,
  labels,
}: ScheduleBoxProps) {
  return (
    <div
      className={cls(
        'USER_COLS relative grid gap-2',
        userLength === 1 ? 'border-x-inherit' : ''
      )}
      style={viewPeriodStyle}
    >
      <TimeIndicatorBar isActive={enableTimeIndicator} />
      {users.map((member, userIndex) => (
        <div
          key={member.id}
          className="USER_COL relative w-full divide-y divide-table-line bg-table-bg hover:bg-gray-200/50"
        >
          <ReservationButtons
            labelMaxLength={labelMaxLength}
            date={date}
            labels={labels}
            userId={member.user.id}
            userIndex={userIndex}
          />
          <EventBoxContainer
            labelMaxLength={labelMaxLength}
            labels={labels}
            events={member.events}
            userIndex={userIndex}
            isSingleUser={userLength === 1}
          />
        </div>
      ))}
    </div>
  );
}

export default ScheduleBox;
