import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

interface SearchBarProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const SearchBar = ({ handleSubmit }: SearchBarProps) => {
  return (
    <form onSubmit={handleSubmit} className="relative mb-3 grow">
      <input type="search" className="input pl-9" />
      <button className="position-center-y absolute left-3 p-1" type="submit">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </form>
  );
};
