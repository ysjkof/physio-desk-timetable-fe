import { type PropsWithChildren } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useWindowSize } from '../../hooks';
import { cls } from '../../utils/commonUtils';
import { BrokenLine, Heart, Medicine } from '../../svgs';
import { ClinicSelector } from '../../components';
import { DASHBOARD_CONTAINER_WIDTH } from '../../constants/constants';
import { ProfileWithImage } from './components';

const Dashboard = () => {
  const { width, isLoading } = useWindowSize(true);
  const outletWidth = width - DASHBOARD_CONTAINER_WIDTH;

  if (isLoading) return null;

  return (
    <div className="flex text-base">
      <div
        className="dashboard-container"
        style={{ width: DASHBOARD_CONTAINER_WIDTH }}
      >
        <ProfileWithImage hasPosition />
        <LinkBtns />
      </div>
      <div
        className="flex w-full flex-col divide-y"
        style={{ width: outletWidth }}
      >
        <div className="flex justify-center p-3">
          <ClinicSelector />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

const LinkBtns = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col text-sm">
      <LinkButton
        path="/dashboard/clinic/members"
        isActive={
          pathname.startsWith('/dashboard/clinic/members') &&
          !pathname.endsWith('/invite')
        }
      >
        <Heart />
        직원열람 및 관리
      </LinkButton>
      <LinkButton
        path="/dashboard/clinic/members/invite"
        isActive={pathname.startsWith('/dashboard/clinic/members/invite')}
      >
        <FontAwesomeIcon icon={faPlus} fontSize="1rem" />
        직원초대
      </LinkButton>
      <LinkButton
        path="/dashboard/clinic/prescriptions"
        isActive={pathname.startsWith('/dashboard/clinic/prescriptions')}
      >
        <Medicine />
        처방등록 및 관리
      </LinkButton>
      <LinkButton
        path="/dashboard/clinic/statistics"
        isActive={pathname.startsWith('/dashboard/clinic/statistics')}
      >
        <BrokenLine />
        통계
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
        'flex items-center gap-2 whitespace-nowrap rounded-md py-2.5 px-2 pl-4 font-bold',
        isActive ? 'bg-[#EEEEFF] text-table-aside-bg' : 'text-table-day-strong'
      )}
    >
      {children}
    </Link>
  );
};

export default Dashboard;
