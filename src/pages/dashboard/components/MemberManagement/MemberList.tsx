import { useEffect, useState } from 'react';
import AlignmentButtons from './AlignmentButtons';
import MemberListItem from './MemberListItem';
import { useGetClinic } from '../../../../hooks';
import { MemberOfGetMyClinic } from '../../../../types/common.types';

const MemberList = () => {
  const [myClinic] = useGetClinic();
  const [members, setMembers] = useState<MemberOfGetMyClinic>([]);

  useEffect(() => {
    if (!myClinic?.members) return;
    setMembers(myClinic.members);
  }, [myClinic]);

  return (
    <div className="mb-8 border-y">
      <AlignmentButtons setMembers={setMembers} />
      <ul className="h-auto divide-y">
        {members.map((member, idx) => (
          <MemberListItem key={member.id} member={member} userIndex={idx} />
        ))}
      </ul>
    </div>
  );
};

export default MemberList;
