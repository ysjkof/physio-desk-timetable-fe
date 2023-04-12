import { Link, Outlet, useLocation } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import { useWindowSize } from '../../hooks';
import { cls } from '../../utils/commonUtils';
import { Building, BuildingPlus, User } from '../../svgs';
import { DASHBOARD_CONTAINER_WIDTH, MUOOL } from '../../constants/constants';
import { ProfileWithImage } from '../dashboard/components';
import { Helmet } from 'react-helmet-async';

const Setting = () => {
  const { width } = useWindowSize(true);
  const outletWidth = width - DASHBOARD_CONTAINER_WIDTH;

  return (
    <>
      <Helmet title={`설정 | ${MUOOL}`} />
      <div className="flex text-base" style={{ width }}>
        <div
          className="dashboard-container"
          style={{ width: DASHBOARD_CONTAINER_WIDTH }}
        >
          <ProfileWithImage />
          <MenuContainer />
        </div>
        <div style={{ width: outletWidth }}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

const MenuContainer = () => {
  const { pathname } = useLocation();
  return (
    <div className="flex flex-col text-sm">
      <LinkButton
        path="/setting/my-info"
        isActive={pathname.startsWith('/setting/my-info')}
      >
        <User />
        나의 정보
      </LinkButton>
      <LinkButton
        path="/setting/my-clinics"
        isActive={pathname.startsWith('/setting/my-clinics')}
      >
        <Building />
        나의 병원
      </LinkButton>
      <LinkButton
        path="/setting/clinic/create"
        isActive={pathname.startsWith('/setting/clinic/create')}
      >
        <BuildingPlus />
        병원 만들기
      </LinkButton>
    </div>
  );
};

interface LinkButtonProps extends PropsWithChildren {
  isActive: boolean;
  path: string;
}

const LinkButton = ({ children, path, isActive }: LinkButtonProps) => {
  return (
    <Link
      to={path}
      className={cls(
        'flex items-center gap-2 rounded-md py-2.5 px-2 pl-4 font-bold',
        isActive ? 'bg-[#EEEEFF] text-table-aside-bg' : 'text-table-day-strong'
      )}
    >
      {children}
    </Link>
  );
};

export default Setting;
