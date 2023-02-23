import { cls, getMemberState } from '../../../../utils/commonUtils';
import TimeIndicatorBar from '../TimeIndicatorBar';
import ReservationButtons from './ReserveButtons';
import EventBoxContainer from './EventBoxContainer';
import type { ScheduleBoxProps } from '../../../../types/propsTypes';

const ScheduleBox = ({
  userLength,
  enableTimeIndicator,
  viewPeriodStyle,
  members,
  date,
  labelMaxLength,
  labels,
}: ScheduleBoxProps) => {
  return (
    <div
      className={cls(
        'relative grid gap-2',
        userLength === 1 ? 'border-x-inherit' : ''
      )}
      style={viewPeriodStyle}
    >
      <TimeIndicatorBar isActive={enableTimeIndicator} />
      {members.map((member, userIndex) => {
        const { accepted, manager, staying } = member;
        const state = getMemberState({ accepted, manager, staying });

        return (
          <div
            key={member.id}
            className="USER_COL relative w-full divide-y divide-table-line bg-table-bg hover:bg-gray-200/50"
          >
            {state === '탈퇴' || (
              <ReservationButtons
                labelMaxLength={labelMaxLength}
                date={date}
                labels={labels}
                userId={member.user.id}
                userIndex={userIndex}
              />
            )}
            <EventBoxContainer
              labelMaxLength={labelMaxLength}
              labels={labels}
              events={member.events}
              userIndex={userIndex}
              isSingleUser={userLength === 1}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ScheduleBox;
