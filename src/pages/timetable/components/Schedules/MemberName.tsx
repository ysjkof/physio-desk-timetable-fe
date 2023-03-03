import { cls, getMemberState } from '../../../../utils/commonUtils';
import { USER_COLORS } from '../../../../constants/constants';
import { useStore } from '../../../../store';
import type { MemberNameProps } from '../../../../types/propsTypes';

const MemberName = ({ userLength, members }: MemberNameProps) => {
  const hiddenUsers = useStore((state) => state.hiddenUsers);

  return (
    <div
      className={cls(
        'schedules__member-name-title',
        userLength === 1 ? 'border-x-inherit' : ''
      )}
    >
      {members.map((member, idx) => {
        const { id, accepted, manager, staying } = member;

        if (hiddenUsers.has(id)) return null;

        const state = getMemberState({ accepted, manager, staying });

        return (
          <div
            key={member.id}
            className="flex w-full min-w-[6rem] flex-col justify-between rounded-sm border border-b-2 border-table-bg px-1 pb-0.5 font-medium"
            style={{ borderBottomColor: USER_COLORS[idx]?.deep || 'inherit' }}
          >
            <span className="h-4 overflow-hidden text-ellipsis whitespace-nowrap">
              {state === '탈퇴' && '탈퇴'}
            </span>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {member.user.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default MemberName;
