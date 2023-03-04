import MemberListItem from './MemberListItem';
import type { MemberOfGetMyClinic } from '../../../../types/processedGeneratedTypes';

const MemberList = ({ members }: { members: MemberOfGetMyClinic[] }) => {
  return (
    <ul className="mb-8 divide-y border-b">
      {members.map((member) => (
        <MemberListItem key={member.id} member={member} />
      ))}
    </ul>
  );
};

export default MemberList;
