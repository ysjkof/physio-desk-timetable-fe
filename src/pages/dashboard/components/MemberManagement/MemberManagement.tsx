import { Link, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
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
          <InviteMemberBtn />
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

const InviteMemberBtn = () => {
  return (
    <Link
      to="invite"
      className="css_default-button rounded-md bg-cst-green text-sm text-white"
    >
      <FontAwesomeIcon
        icon={faPlus}
        className="rounded-full border p-0.5"
        size="xs"
      />
      직원 초대하기
    </Link>
  );
};

export default MemberManagement;
