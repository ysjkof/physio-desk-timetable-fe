import { type ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const SearchPrescription = () => {
  const searchMembers = (event: ChangeEvent<HTMLInputElement>) => {};

  return (
    <label className="relative w-full" htmlFor="dashboard-prescription-search">
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="position-center-y absolute left-2"
      />
      <input
        id="dashboard-prescription-search"
        type="text"
        className="input py-1 pl-7"
        placeholder="처방이름을 검색하세요"
        onChange={searchMembers}
      />
    </label>
  );
};

export default SearchPrescription;
