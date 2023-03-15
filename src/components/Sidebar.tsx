import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { cls } from '../utils/commonUtils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}
interface ClassNameProps {
  className?: string;
}

interface SelectedProps {
  selected?: boolean;
}

interface ToProps extends PropsWithChildren, SelectedProps {
  to: string;
  onClick?: () => void;
}
interface OnClickProps extends PropsWithChildren, SelectedProps {
  onClick: () => void;
  to?: string;
}

interface UlProps extends PropsWithChildren {
  title?: React.ReactNode;
  removePadding?: boolean;
  opacity?: boolean;
}
interface SidebarProps extends PropsWithChildren, ClassNameProps {
  disable?: boolean;
  noGap?: boolean;
}

function Button({ children, ...args }: ButtonProps) {
  return (
    <button
      type="button"
      {...args}
      className={cls(
        'flex h-full w-full cursor-pointer items-center',
        args.className || ''
      )}
    >
      {children}
    </button>
  );
}

function Li({ to, onClick, children, selected }: ToProps | OnClickProps) {
  return (
    <li
      className={cls(
        'relative h-full w-full cursor-pointer whitespace-nowrap rounded-none text-sm hover:font-normal hover:text-gray-600',
        selected ? 'font-medium text-gray-600' : 'font-light text-gray-500'
      )}
    >
      {to ? (
        <Link
          to={to}
          className={cls(
            'block h-full w-full border-l py-1.5 pl-4 text-left',
            selected
              ? 'before:pointer-events-none before:absolute before:-left-0.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-green-500'
              : ''
          )}
        >
          {children}
        </Link>
      ) : (
        <button
          onClick={onClick}
          className={cls(
            'block h-full w-full py-1.5 pl-7 text-left',
            selected
              ? 'before:pointer-events-none before:absolute before:left-1.5 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-green-500'
              : ''
          )}
          type="button"
        >
          {children}
        </button>
      )}
    </li>
  );
}

function Ul({ children, title, removePadding, opacity }: UlProps) {
  return (
    <div
      className={cls(
        'flex flex-col pl-4',
        removePadding ? '' : 'pr-16',
        opacity ? 'opacity-50' : ''
      )}
    >
      {title && (
        <h1 className="whitespace-nowrap pt-4 pb-2 text-sm font-semibold">
          {title}
        </h1>
      )}
      <ul>{children}</ul>
    </div>
  );
}

function Sidebar({ children, className, disable, noGap }: SidebarProps) {
  return (
    <div
      className={cls(
        'SIDE-BAR flex flex-col',
        disable ? 'pointer-events-none opacity-25' : '',
        noGap ? '' : 'space-y-10',
        className || ''
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
