import { type ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import type { MemberOfGetMyClinic } from '../../../../types/commonTypes';

interface SearchAndInviteMemberProps {
  members: MemberOfGetMyClinic | undefined;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}

const SearchMember = ({
  members,
  setSearchInput,
}: SearchAndInviteMemberProps) => {
  const searchMembers = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    if (!members) return;
    if (!value) return setSearchInput('');

    setSearchInput(value);
  };

  return (
    <label className="relative w-full" htmlFor="dashboard-search-member">
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="position-center-y absolute left-3"
      />
      <input
        id="dashboard-search-member"
        type="text"
        className="css_default-input pl-9"
        placeholder="직원을 검색하세요"
        onChange={searchMembers}
      />
    </label>
  );
};

export default SearchMember;
