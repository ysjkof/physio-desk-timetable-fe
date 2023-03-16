import { cls } from '../../../../../../utils/commonUtils';
import TimeIndicatorBar from '../../../TimeIndicatorBar';
import ReserveBtnList from './ReserveBtnList';
import EventBoxContainer from './EventBoxContainer';
import { useStore } from '../../../../../../store';
import { TABLE_CELL_HEIGHT } from '../../../../../../constants/constants';
import { Member } from '../../../../../../models';
import type { ScheduleBoxProps } from '../../../../../../types/propsTypes';

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
        'schedules__users-column',
        userLength === 1 ? 'border-x-inherit' : ''
      )}
    >
      <TimeIndicatorBar isActive={enableTimeIndicator} />
      {members.map((_member) => {
        const member = new Member(_member);
        if (hiddenUsers.has(_member.id)) return null;

        const userId = _member.user.id;
        const state = member.getState();
        const color = member.getColor();

        return (
          <div
            key={userId}
            className={cls(
              'schedules__each-user-column',
              state === '탈퇴' ? 'border bg-gray-200/50' : ''
            )}
            style={{ height }}
          >
            {state === '탈퇴' || (
              <ReserveBtnList
                labelMaxLength={labelMaxLength}
                date={date}
                labels={labels}
                userId={userId}
                color={color}
              />
            )}
            <EventBoxContainer
              labelMaxLength={labelMaxLength}
              labels={labels}
              events={_member.events}
              isSingleUser={userLength === 1}
              color={color}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ScheduleBox;
