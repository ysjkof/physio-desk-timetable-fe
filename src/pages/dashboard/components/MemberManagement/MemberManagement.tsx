import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SearchMember from './SearchMember';
import AlignmentButtons from './AlignmentButtons';
import MemberList from './MemberList';
import { useGetClinic } from '../../../../hooks';
import type { MemberOfGetMyClinic } from '../../../../types/processedGeneratedTypes';

const MemberManagement = () => {
  const [myClinic] = useGetClinic();
  const [members, setMembers] = useState<MemberOfGetMyClinic>([]);
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
    <>
      <div className="css_dashboard__member-management-column__1st">
        <h1 className="mb-8 pl-4 text-3xl font-medium">직원열람 및 관리</h1>
        <div className="relative mb-7 flex items-center justify-between gap-4 px-4">
          <SearchMember
            members={myClinic?.members}
            setSearchInput={setSearchInput}
          />
        </div>
        <AlignmentButtons setMembers={setMembers} />
        <MemberList members={members} />
      </div>
      <div
        className="css_dashboard__member-management-column__2nd relative"
        style={{ width: 'calc(100% - 560px)' }}
      >
        <Outlet />
      </div>
    </>
  );
};

export default MemberManagement;
