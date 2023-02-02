import { useState } from 'react';
import { ClinicsOfClient } from '../../../../../models';
import AlignmentButtons from './AlignmentButtons';
import MemberListItem from './MemberListItem';

const MemberList = () => {
  const [members, setMembers] = useState(
    ClinicsOfClient.getSelectedClinic().members
  );

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
