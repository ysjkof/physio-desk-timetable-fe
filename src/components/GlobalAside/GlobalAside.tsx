import { type PropsWithChildren } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cls } from '../../utils/commonUtils';
import { CogSixTooth, Building, Table, MenuOpen } from '../../svgs';
import { useLogout } from '../../hooks';
import { toggleIsBigGlobalAside, useStore } from '../../store';
import Logo from '../Logo';

const GlobalAside = () => {
  const isBigGlobalAside = useStore((state) => state.isBigGlobalAside);

  const toggleAside = () => {
    toggleIsBigGlobalAside(!isBigGlobalAside);
  };

  const menu = useLocation().pathname.split('/')[1];

  const logout = useLogout();

  const logoSize = isBigGlobalAside ? 'xl' : 'xs';

  return (
    <aside
      id="global-aside"
      className="relative flex h-full flex-col justify-between bg-table-aside-bg py-4 text-white"
    >
      <div className="relative mb-6 flex h-28 flex-col items-center pt-7">
        <Link
          to="/"
          className={cls(
            'flex items-center justify-center ',
            isBigGlobalAside ? 'w-12' : 'absolute w-9'
          )}
        >
          <Logo size={logoSize} isVertical />
        </Link>
      </div>
      <button
        type="button"
        onClick={toggleAside}
        className="absolute -right-2.5 -top-0.5 z-40 w-fit rounded-full bg-inherit p-1"
      >
        <MenuOpen
          className={cls('h-7 w-7', isBigGlobalAside ? '' : '-scale-x-100')}
        />
      </button>

      <Ul>
        <Li to="tt" selected={menu === 'tt'}>
          <Table />
          {isBigGlobalAside && '시간표'}
        </Li>
        <Li to="dashboard/clinic/members" selected={menu === 'dashboard'}>
          <Building />
          {isBigGlobalAside && '병원'}
        </Li>
        <Li to="setting" selected={menu === 'setting'}>
          <CogSixTooth />
          {isBigGlobalAside && '설정'}
        </Li>
      </Ul>

      <div className="flex flex-col gap-2 text-xs text-gray-400">
        <button type="button" onClick={logout}>
          로그아웃
        </button>
        <button type="button">문의하기</button>
      </div>
    </aside>
  );
};

interface UlProps extends PropsWithChildren {}

const Ul = ({ children }: UlProps) => {
  return (
    <div className="flex h-full flex-col text-gray-500">
      <ul>{children}</ul>
    </div>
  );
};

interface LiProps extends PropsWithChildren {
  to: string;
  selected?: boolean;
}

const Li = ({ to, children, selected }: LiProps) => {
  return (
    <li className="relative w-full cursor-pointer list-none whitespace-nowrap text-xs">
      <Link
        to={to}
        className={cls(
          'flex h-full w-full items-center gap-1 px-4 py-1.5 text-left',
          selected ? 'bg-[#7477B2] font-medium text-white' : 'hover:text-white'
        )}
      >
        {children}
      </Link>
    </li>
  );
};

export default GlobalAside;
