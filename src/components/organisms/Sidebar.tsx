import { ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { cls } from '../../utils/utils';

interface ChildrenProps {
  children: React.ReactNode;
  selectedLi?: boolean;
}
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}
interface LiProps extends ChildrenProps {
  to: string;
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

function Li({ to, children, selectedLi }: LiProps) {
  return (
    <li
      className={cls(
        'h-full w-full cursor-pointer rounded-none hover:bg-gray-100',
        selectedLi ? 'bg-green-100 font-semibold' : ''
      )}
    >
      <Link to={to} className="block h-full w-full py-1.5 px-8">
        {children}
      </Link>
    </li>
  );
}

function Ul({ children, title }: UlProps) {
  return (
    <ul className="flex flex-col">
      {title && (
        <h3 className="pointer-events-none px-4 pt-4 pb-2 text-sm font-semibold">
          {title}
        </h3>
      )}
      {children}
    </ul>
  );
}

function Sidebar({ children, disable }: SidebarPoprs) {
  return (
    <div
      className={cls(
        'flex flex-col divide-y',
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
