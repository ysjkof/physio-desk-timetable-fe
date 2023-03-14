import { Link, useParams } from 'react-router-dom';
import { cls } from '../../../../utils/commonUtils';
import { Member } from '../../../../models';
import type { MemberOfClient } from '../../../../types/commonTypes';

interface MemberListItemProps {
  member: MemberOfClient;
}

const MemberListItem = (props: MemberListItemProps) => {
  const { member: _member } = props;

  const member = new Member(_member);
  const memberState = member.getState();
  const memberName = member.getName();
  const color = member.getColor();

  const { memberId } = useParams();
  const _memberId = '' + _member.id;
  const enabled = _memberId === memberId;

  return (
    <li key={_memberId}>
      <Link
        to={_memberId}
        className={cls(
          'flex items-center justify-between gap-4 py-4 px-4 text-base',
          enabled ? 'bg-[#EEEEFF]' : ''
        )}
      >
        <span
          className="aspect-square w-9 rounded-md bg-red-200 text-center text-white"
          style={{ backgroundColor: color }}
        >
          {memberName.substring(0, 1)}
        </span>
        <span className="basis-full text-table-aside-bg">{memberName}</span>
        <span
          className={cls(
            'w-24',
            memberState === '수락대기'
              ? ' text-green-600'
              : memberState === '탈퇴'
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
