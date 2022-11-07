import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { cls } from '../../../../utils/utils';

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
export interface UlProps extends PropsWithChildren {
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

function Li({ to, children, selected }: ToProps) {
  return (
    <li
      className={cls(
        'relative w-full cursor-pointer list-none whitespace-nowrap rounded-none text-sm hover:font-normal hover:text-gray-600',
        selected ? 'font-medium text-gray-600' : 'font-light text-gray-500'
      )}
    >
      <Link
        to={to}
        className={cls(
          'flex h-full w-full items-center gap-1 py-1.5 px-4 pl-4 text-left',
          selected ? 'bg-[#7477B2] text-white' : ''
        )}
      >
        {children}
      </Link>
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
