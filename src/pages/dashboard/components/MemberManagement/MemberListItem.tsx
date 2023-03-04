import { Link, useParams } from 'react-router-dom';
import { cls, getMemberState } from '../../../../utils/commonUtils';
import type { MemberOfClient } from '../../../../types/commonTypes';

interface MemberListItemProps {
  member: MemberOfClient;
}

const MemberListItem = ({ member }: MemberListItemProps) => {
  const memberState = getMemberState({
    staying: member.staying,
    accepted: member.accepted,
    manager: member.manager,
  });

  const { memberId } = useParams();
  const enabled = member.id === Number(memberId);

  return (
    <li key={member.id}>
      <Link
        to={`${member.id}`}
        className={cls(
          'flex items-center justify-between gap-4 py-4 px-4 text-base',
          enabled ? 'bg-[#EEEEFF]' : ''
        )}
      >
        <span
          className="aspect-square w-9 rounded-md bg-red-200 text-center text-white"
          style={{ backgroundColor: member.color?.value }}
        >
          {member.user.name.substring(0, 1)}
        </span>
        <span className="basis-full text-table-aside-bg">
          {member.user.name}
        </span>
        <span
          className={cls(
            'w-24',
            memberState === '수락대기'
              ? 'text-caution'
              : 'text-table-day-strong'
          )}
        >
          {memberState}
        </span>
      </Link>
    </li>
  );
};

export default MemberListItem;
