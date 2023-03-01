import { type ChangeEvent } from 'react';
import { SearchInput } from '../../../../components';
import type { MemberOfGetMyClinic } from '../../../../types/processedGeneratedTypes';

interface SearchAndInviteMemberProps {
  members: MemberOfGetMyClinic[] | undefined;
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
    <SearchInput
      id="dashboard-search-member"
      name="dashboard-search-member"
      placeholder="직원을 검색하세요"
      onChange={searchMembers}
    />
  );
};

export default SearchMember;
