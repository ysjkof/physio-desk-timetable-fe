import { ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { cls } from '../../utils/utils';

interface ChildrenProps {
  children: React.ReactNode;
}
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}
interface LiProps extends ChildrenProps {
  to: string;
  selected?: boolean;
}
interface UlProps extends ChildrenProps {
  title?: string;
}
interface SidebarPoprs extends ChildrenProps {
  disable?: boolean;
}

function Button({ children, ...args }: ButtonProps) {
  return (
    <button className={cls('h-full w-full cursor-pointer')} {...args}>
      {children}
    </button>
  );
}

function Li({ to, children, selected }: LiProps) {
  return (
    <li
      className={cls(
        'relative h-full w-full cursor-pointer whitespace-nowrap rounded-none text-sm hover:font-normal hover:text-gray-600',
        selected ? 'font-medium text-gray-600' : 'font-light text-gray-500'
      )}
    >
      <Link
        to={to}
        className={cls(
          'block h-full w-full border-l py-1.5 pl-4',
          selected
            ? 'before:pointer-events-none before:absolute before:-left-0.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-green-500'
            : ''
        )}
      >
        {children}
      </Link>
    </li>
  );
}

function Ul({ children, title }: UlProps) {
  return (
    <div className="flex flex-col pl-4 pr-16">
      {title && (
        <h1 className="pointer-events-none whitespace-nowrap pt-4 pb-2 text-sm font-semibold">
          {title}
        </h1>
      )}
      <ul>{children}</ul>
    </div>
  );
}

function Sidebar({ children, disable }: SidebarPoprs) {
  return (
    <div
      className={cls(
        'SIDE-BAR flex flex-col space-y-10',
        disable ? 'pointer-events-none opacity-25' : ''
      )}
    >
      {children}
    </div>
  );
}

Sidebar.Button = Button;
Sidebar.Li = Li;
Sidebar.Ul = Ul;

export default Sidebar;
