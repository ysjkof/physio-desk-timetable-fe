import { cls, getMemberState } from '../../../../utils/commonUtils';
import TimeIndicatorBar from '../TimeIndicatorBar';
import ReservationButtons from './ReserveButtons';
import EventBoxContainer from './EventBoxContainer';
import { useStore } from '../../../../store';
import { TABLE_CELL_HEIGHT } from '../../../../constants/constants';
import type { ScheduleBoxProps } from '../../../../types/propsTypes';

const ScheduleBox = ({
  userLength,
  enableTimeIndicator,
  members,
  date,
  labelMaxLength,
  labels,
}: ScheduleBoxProps) => {
  const hiddenUsers = useStore((state) => state.hiddenUsers);

  const height = (labels.length - 1) * TABLE_CELL_HEIGHT;

  return (
    <div
      className={cls(
        'relative flex gap-2',
        userLength === 1 ? 'border-x-inherit' : ''
      )}
    >
      <TimeIndicatorBar isActive={enableTimeIndicator} />
      {members.map((member) => {
        const { id, accepted, manager, staying } = member;

        if (hiddenUsers.has(id)) return null;

        const state = getMemberState({ accepted, manager, staying });

        return (
          <div
            key={member.id}
            className={cls(
              'schedules__each-user-column',
              state === '탈퇴' ? 'border bg-gray-200/50 hover:bg-none' : ''
            )}
            style={{ height }}
          >
            {state === '탈퇴' || (
              <ReservationButtons
                labelMaxLength={labelMaxLength}
                date={date}
                labels={labels}
                userId={member.user.id}
                color={member.color?.value}
              />
            )}
            <EventBoxContainer
              labelMaxLength={labelMaxLength}
              labels={labels}
              events={member.events}
              isSingleUser={userLength === 1}
              color={member.color?.value}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ScheduleBox;
