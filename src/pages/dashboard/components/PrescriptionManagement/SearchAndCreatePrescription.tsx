import { type ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const SearchAndCreatePrescription = () => {
  const searchMembers = (event: ChangeEvent<HTMLInputElement>) => {
    // TODO: 어떤 방식으로 검색할 것인가?
  };

  const createPrescription = () => {};

  return (
    <div className="flex items-center justify-between gap-4 px-4">
      <label
        className="relative w-full"
        htmlFor="dashboard-prescription-search"
      >
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="position-center-y absolute left-2"
        />
        <input
          id="dashboard-prescription-search"
          type="text"
          className="css_default-input py-1 pl-7"
          placeholder="처방이름을 검색하세요"
          onChange={searchMembers}
        />
      </label>
      <Link
        to="create"
        type="button"
        className="css_default-button rounded-md bg-[#26C06D] text-sm text-white"
        onClick={createPrescription}
      >
        <FontAwesomeIcon
          icon={faPlus}
          className="rounded-full border p-0.5"
          size="xs"
        />
        처방 등록하기
      </Link>
    </div>
  );
};

export default SearchAndCreatePrescription;
