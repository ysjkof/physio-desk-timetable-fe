import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPositionRef } from '../../utils/utils';
import ModalPortal from '../templates/ModalPortal';

interface ChildrenProps {
  children: React.ReactNode;
}

interface ButtonProps extends ChildrenProps {
  onClick: () => void;
}
interface LiProps extends ChildrenProps {
  to: string;
}
interface UlProps extends ChildrenProps {}
interface ContainerProps extends ChildrenProps {
  width: string;
}

interface DropdownProps extends ChildrenProps {
  title: React.ReactNode;
}

function Span({ children }: ChildrenProps) {
  return (
    <span className="flex overflow-hidden text-ellipsis whitespace-nowrap py-1 px-2 text-center hover:bg-blue-200">
      {children}
    </span>
  );
}

function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      className="w-full overflow-hidden text-ellipsis whitespace-nowrap px-2 py-1 text-center hover:bg-blue-200"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Li({ to, children }: LiProps) {
  return (
    <Link
      to={to}
      className="w-full overflow-hidden text-ellipsis whitespace-nowrap px-2 py-1 text-center hover:bg-blue-200"
    >
      {children}
    </Link>
  );
}

function Ul({ children }: UlProps) {
  return <ul className="flex flex-col">{children}</ul>;
}
function Container({ children, width }: ContainerProps) {
  return (
    <div
      className="flex-col items-center divide-y overflow-hidden border bg-white text-base shadow-cst"
      style={{ width }}
    >
      {children}
    </div>
  );
}

function Dropdown({ title, children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const ref = useRef<HTMLDivElement>(null);
  const { top } = getPositionRef(ref, 3);

  return (
    <div className="relative cursor-pointer" onClick={toggleMenu} ref={ref}>
      <div className="max-w-[10rem] overflow-hidden text-ellipsis whitespace-nowrap font-extrabold">
        {title}
      </div>
      {isOpen && (
        <ModalPortal right={4} top={top} closeAction={() => setIsOpen}>
          {children}
        </ModalPortal>
      )}
    </div>
  );
}

Dropdown.Button = Button;
Dropdown.Span = Span;
Dropdown.Li = Li;
Dropdown.Ul = Ul;
Dropdown.Container = Container;

export default Dropdown;
