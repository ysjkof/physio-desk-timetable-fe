import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { cls } from '../../utils/utils';

interface ChildrenProps {
  children: React.ReactNode;
}

interface ButtonProps extends ChildrenProps {
  onClick: () => void;
}
interface OptionProps extends ChildrenProps {
  onClick: () => void;
  selected?: boolean;
  suffix?: string;
}
interface OptionsProps extends ChildrenProps {}
interface SelectboxProps extends ChildrenProps {
  selectedValue: string;
  width?: string;
}

function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      className="relative h-full w-full overflow-hidden text-ellipsis whitespace-nowrap py-1 pl-2 pr-5 text-center hover:bg-blue-200"
      onClick={onClick}
    >
      {children}
      <FontAwesomeIcon
        icon={faChevronDown}
        fontSize={14}
        className="absolute right-2"
      />
    </button>
  );
}

function Option({ children, selected, suffix, onClick }: OptionProps) {
  return (
    <span
      onClick={onClick}
      className={cls(
        'flex w-full items-center justify-between overflow-hidden text-ellipsis whitespace-nowrap bg-white px-2 py-1 hover:bg-blue-200',
        selected ? 'font-semibold' : ''
      )}
    >
      <span>{children}</span>
      <span>{suffix || ''}</span>
    </span>
  );
}

function Options({ children }: OptionsProps) {
  return (
    <ul className="absolute right-0 z-50 flex w-full flex-col shadow-cst">
      {children}
    </ul>
  );
}

function Selectbox({ children, selectedValue, width }: SelectboxProps) {
  const [isOpen, setIsOpen] = useState(
    process.env.NODE_ENV === 'product' ? true : false
  );
  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    toggleMenu();
  }, [selectedValue]);

  return (
    <div className="relative h-8 cursor-pointer border-b" style={{ width }}>
      <Button onClick={toggleMenu}>{selectedValue}</Button>
      {isOpen && (
        <>
          {children}
          <div
            className="fixed top-0 z-40 h-screen w-screen"
            onClick={toggleMenu}
          />
        </>
      )}
    </div>
  );
}

Selectbox.Option = Option;
Selectbox.Options = Options;

export default Selectbox;
