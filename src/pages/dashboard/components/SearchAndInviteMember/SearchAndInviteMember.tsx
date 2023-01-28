import { type ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';

const SearchAndInviteMember = () => {
  const searchMembers = (event: ChangeEvent<HTMLInputElement>) => {
    // TODO: 어떤 방식으로 검색할 것인가?
  };

  const inviteUserToClinic = () => {};

  return (
    <div className="mb-7 flex items-center justify-between gap-4 px-4">
      <label className="relative w-full" htmlFor="dashboard-user-search">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="position-center-y absolute left-2"
        />
        <input
          id="dashboard-user-search"
          type="text"
          className="css_default-input pl-6"
          placeholder="직원을 검색하세요"
          onChange={searchMembers}
        />
      </label>
      <button
        type="button"
        className="css_default-button rounded-md bg-cst-green text-sm text-white"
        onClick={inviteUserToClinic}
      >
        <FontAwesomeIcon
          icon={faPlus}
          className="rounded-full border p-0.5"
          size="xs"
        />
        직원 초대하기
      </button>
    </div>
  );
};

export default SearchAndInviteMember;
