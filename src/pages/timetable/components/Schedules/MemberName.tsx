import { cls } from '../../../../utils/common.utils';
import type { MemberNameProps } from '../../../../types/props.types';

const MemberName = ({
  userLength,
  viewPeriodStyle,
  users,
}: MemberNameProps) => {
  return (
    <div
      className={cls(
        'USER_COLS relative mb-1 grid h-9 gap-2',
        userLength === 1 ? 'border-x-inherit' : ''
      )}
      style={viewPeriodStyle}
    >
      {users.map((member) => (
        <div
          key={member.id}
          className="rounded-sm border border-table-bg px-1 pb-0.5 pt-4 font-medium"
        >
          {member.user.name}
        </div>
      ))}
    </div>
  );
};

export default MemberName;
