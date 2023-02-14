import MemberListItem from './MemberListItem';
import type { MemberOfGetMyClinic } from '../../../../types/common.types';

const MemberList = ({ members }: { members: MemberOfGetMyClinic }) => {
  return (
    <ul className="mb-8 divide-y border-b">
      {members.map((member, idx) => (
        <MemberListItem key={member.id} member={member} userIndex={idx} />
      ))}
    </ul>
  );
};

export default MemberList;
