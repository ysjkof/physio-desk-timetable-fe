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
interface SidebarPoprs extends ChildrenProps {}

function Li({ to, children, selectedLi }: LiProps) {
  return (
    <li
      className={cls(
        'h-full w-full cursor-pointer rounded-none hover:bg-red-200',
        selectedLi ? 'bg-green-100 font-semibold' : ''
        // isManagerMenu && selectedClinic.isManager === false
        //   ? 'pointer-events-none opacity-50'
        //   : ''
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

function Sidebar({ children }: SidebarPoprs) {
  return <div className="flex flex-col divide-y">{children}</div>;
}

Sidebar.Li = Li;
Sidebar.Ul = Ul;

export default Sidebar;
