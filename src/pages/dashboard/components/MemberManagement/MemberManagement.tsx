import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SearchMember from './SearchMember';
import AlignmentButtons from './AlignmentButtons';
import MemberList from './MemberList';
import { useGetClinic } from '../../../../hooks';
import { ProtectStayMember, Warning } from '../../../../components';
import type { MemberOfGetMyClinic } from '../../../../types/processedGeneratedTypes';

const MemberManagement = () => {
  const [myClinic] = useGetClinic();
  const [members, setMembers] = useState<MemberOfGetMyClinic[]>([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    if (!myClinic?.members) return;
    if (!searchInput) return setMembers(myClinic.members);

    const filtered = myClinic.members.filter((member) =>
      member.user.name.match(searchInput)
    );
    setMembers(filtered.length === 0 ? myClinic.members : filtered);
  }, [myClinic, searchInput]);

  return (
    <ProtectStayMember
      clinicId={myClinic?.id}
      fallback={<Warning type="hasNotPermission" />}
    >
      <div className="member-management">
        <div className="member-management__nav overflow-y-scroll">
          <h1 className="dashboard-menu-title mb-6 px-10">직원열람 및 관리</h1>
          <div className="mb-6 px-10">
            <SearchMember
              members={myClinic?.members}
              setSearchInput={setSearchInput}
            />
          </div>
          <AlignmentButtons setMembers={setMembers} />
          <MemberList members={members} />
        </div>
        <div className="member-management__member-detail-container">
          <Outlet />
        </div>
      </div>
    </ProtectStayMember>
  );
};

export default MemberManagement;
