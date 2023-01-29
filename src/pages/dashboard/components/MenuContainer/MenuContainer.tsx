import { type PropsWithChildren } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrokenLine, Heart, Medicine } from '../../../../svgs';
import { cls } from '../../../../utils/common.utils';

const MenuContainer = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col text-sm">
      <LinkButton
        path="/dashboard/clinic/members"
        isActivate={pathname === '/dashboard/clinic/members'}
      >
        <Heart />
        직원열람 및 관리
      </LinkButton>
      <LinkButton
        path="/dashboard/clinic/prescriptions"
        isActivate={pathname === '/dashboard/clinic/prescriptions'}
      >
        <Medicine />
        처방등록 및 관리
      </LinkButton>
      <LinkButton
        path="/dashboard/clinic/statistics"
        isActivate={pathname === '/dashboard/clinic/statistics'}
      >
        <BrokenLine />
        통계
      </LinkButton>
    </div>
  );
};

interface LinkButtonProps extends PropsWithChildren {
  isActivate: boolean;
  path: string;
}

const LinkButton = ({ children, path, isActivate }: LinkButtonProps) => {
  return (
    <Link
      to={path}
      className={cls(
        'flex items-center gap-2 rounded-md py-2.5 px-2 pl-4 font-bold',
        isActivate
          ? 'bg-[#EEEEFF] text-table-aside-bg'
          : 'text-table-day-strong'
      )}
    >
      {children}
    </Link>
  );
};

export default MenuContainer;
