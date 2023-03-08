import { CSSProperties, PropsWithChildren, useEffect, useState } from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cls } from '../utils/commonUtils';

interface ButtonProps extends PropsWithChildren {
  onClick: () => void;
  hasHoverBg?: boolean;
  iconSize?: number;
  isBigTitle?: boolean;
}
interface OptionProps extends PropsWithChildren {
  onClick: () => void;
  isActive?: boolean;
}

interface SelectboxProps extends PropsWithChildren {
  label: string;
  iconSize?: number;
  hasBorder?: boolean;
  hasHoverBgTitle?: boolean;
  style?: CSSProperties;
  isBigTitle?: boolean;
}

const Button = ({
  children,
  onClick,
  hasHoverBg = false,
  iconSize = 14,
  isBigTitle,
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={cls(
        'relative h-full w-full overflow-hidden text-ellipsis whitespace-nowrap pl-2 pr-5 text-center',
        hasHoverBg ? 'hover:bg-blue-200' : '',
        isBigTitle ? 'text-xl font-medium' : ''
      )}
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

const Option = ({ children, isActive, onClick }: OptionProps) => {
  return (
    <li
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex={0}
      className={cls(
        'flex w-full items-center justify-center text-ellipsis whitespace-nowrap bg-inherit px-2 py-1 hover:bg-blue-200',
        isActive ? 'bg-[#F2F2F9] font-medium' : ''
      )}
    >
      {children}
    </li>
  );
};

const Options = ({ children }: PropsWithChildren) => {
  return (
    <ul className="absolute top-9 z-50 flex max-h-60 w-full flex-col overflow-y-scroll rounded-md border border-inherit bg-inherit">
      {children}
    </ul>
  );
};

const Selectbox = ({
  children,
  label,
  iconSize,
  hasBorder,
  hasHoverBgTitle = false,
  style,
  isBigTitle,
}: SelectboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prevState) => !prevState);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    closeMenu();
  }, [label]);

  return (
    <div
      className={cls(
        'relative w-full cursor-pointer rounded-md bg-white',
        hasBorder ? 'border border-[#6BA6FF]' : ''
      )}
      style={style}
    >
      <Button
        onClick={toggleMenu}
        iconSize={iconSize}
        hasHoverBg={hasHoverBgTitle}
        isBigTitle={isBigTitle}
      >
        {label}
      </Button>
      {isOpen && (
        <>
          {children}
          <div
            className="fixed top-0 left-0 z-40 h-screen w-screen cursor-default"
            onClick={closeMenu}
            onKeyDown={closeMenu}
            role="button"
            tabIndex={0}
          />
        </>
      )}
    </div>
  );
};

Selectbox.Option = Option;
Selectbox.Options = Options;

export default Selectbox;
