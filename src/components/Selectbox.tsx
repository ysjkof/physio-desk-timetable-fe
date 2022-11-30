import { PropsWithChildren, useEffect, useState } from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cls } from '../utils/common.utils';

interface ButtonProps extends PropsWithChildren {
  onClick: () => void;
  iconSize?: number;
}
interface OptionProps extends PropsWithChildren {
  onClick: () => void;
  selected?: boolean;
  suffix?: string;
}
interface OptionsProps extends PropsWithChildren {}
interface SelectboxProps extends PropsWithChildren {
  selectedValue: string;
  width?: string;
  iconSize?: number;
  hasBorder?: boolean;
  backgroundColor?: string;
}

const Button = ({ children, onClick, iconSize = 14 }: ButtonProps) => {
  return (
    <button
      type="button"
      className="relative h-full w-full overflow-hidden text-ellipsis whitespace-nowrap py-1 pl-2 pr-5 text-center hover:bg-blue-200"
      onClick={onClick}
    >
      {children}
      <FontAwesomeIcon
        icon={faChevronDown}
        fontSize={iconSize}
        className="position-center-y absolute right-2"
      />
    </button>
  );
};

const Option = ({ children, selected, suffix, onClick }: OptionProps) => {
  return (
    <span
      onClick={onClick}
      className={cls(
        'flex w-full items-center justify-between overflow-hidden text-ellipsis whitespace-nowrap bg-inherit px-2 py-1 hover:bg-blue-200',
        selected ? 'font-semibold' : ''
      )}
    >
      <span>{children}</span>
      <span>{suffix || ''}</span>
    </span>
  );
};

const Options = ({ children }: OptionsProps) => {
  return (
    <ul className="absolute right-0 z-50 flex w-full flex-col border border-inherit bg-inherit shadow-cst">
      {children}
    </ul>
  );
};

const Selectbox = ({
  children,
  selectedValue,
  width,
  iconSize,
  hasBorder,
  backgroundColor = 'white',
}: SelectboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prevState) => !prevState);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    closeMenu();
  }, [selectedValue]);

  return (
    <div
      className={cls(
        'relative h-8 w-full cursor-pointer',
        hasBorder ? 'rounded-sm border border-[#606295]' : 'border-b'
      )}
      style={{ width, backgroundColor }}
    >
      <Button onClick={toggleMenu} iconSize={iconSize}>
        {selectedValue}
      </Button>
      {isOpen && (
        <>
          {children}
          <div
            className="fixed top-0 z-40 h-screen w-screen"
            onClick={closeMenu}
          />
        </>
      )}
    </div>
  );
};

Selectbox.Option = Option;
Selectbox.Options = Options;

export default Selectbox;
