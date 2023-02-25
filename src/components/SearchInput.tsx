import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from './Input';
import type { InputProps } from '../types/propsTypes';

interface SearchInputProps extends InputProps {}

const SearchInput = (props: SearchInputProps) => {
  const { ...args } = props;

  return (
    <label className="relative w-full" htmlFor={args.id || 'search-input'}>
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="position-center-y absolute left-3"
      />
      <Input
        {...args}
        className="input pl-9"
        type="search"
        id={args.id || 'search-input'}
      />
    </label>
  );
};

export default SearchInput;
