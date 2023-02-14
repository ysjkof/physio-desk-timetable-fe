import { cls } from '../../../../utils/common.utils';
import { USER_COLORS } from '../../../../constants/constants';
import type { MemberNameProps } from '../../../../types/props.types';

const MemberName = ({
  userLength,
  viewPeriodStyle,
  members,
}: MemberNameProps) => {
  return (
    <div
      className={cls(
        'timetable-member-name-title grid',
        userLength === 1 ? 'border-x-inherit' : ''
      )}
      style={viewPeriodStyle}
    >
      {members.map((member, idx) => (
        <div
          key={member.id}
          className="flex items-center justify-between rounded-sm border border-b-2 border-table-bg px-1 pb-0.5 pt-4 font-medium"
          style={{ borderBottomColor: USER_COLORS[idx]?.deep || 'inherit' }}
        >
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {member.user.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default MemberName;
