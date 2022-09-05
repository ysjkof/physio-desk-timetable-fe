import { Link } from 'react-router-dom';
import { cls } from '../../utils/utils';

interface ChildrenProps {
  children: React.ReactNode;
  selectedLi?: boolean;
}
interface LiProps extends ChildrenProps {
  to: string;
}
interface UlProps extends ChildrenProps {}
interface SidebarPoprs extends ChildrenProps {
  disable?: boolean;
}

function Li({ to, children, selectedLi }: LiProps) {
  return (
    <li
      className={cls(
        'h-full w-full cursor-pointer rounded-none hover:bg-gray-100',
        selectedLi ? 'bg-green-100 font-semibold' : ''
      )}
    >
      <Link to={to} className="block h-full w-full py-1.5 px-2">
        {children}
      </Link>
    </li>
  );
}

function Ul({ children }: UlProps) {
  return <ul className="flex flex-col">{children}</ul>;
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

Sidebar.Li = Li;
Sidebar.Ul = Ul;

export default Sidebar;
