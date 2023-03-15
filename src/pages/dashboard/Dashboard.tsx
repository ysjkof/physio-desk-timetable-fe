import { Link, Outlet, useLocation } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useStore } from '../../store';
import { useGetMyMembers, useMe, useWindowSize } from '../../hooks';
import { cls } from '../../utils/commonUtils';
import { BrokenLine, Heart, Medicine, User } from '../../svgs';
import { ClinicSelector } from '../../components';
import { DASHBOARD_CONTAINER_WIDTH } from '../../constants/constants';

const Dashboard = () => {
  const { width } = useWindowSize(true);
  const outletWidth = width - DASHBOARD_CONTAINER_WIDTH;

  return (
    <div className="flex text-base" style={{ width }}>
      <div
        className="dashboard-container"
        style={{ width: DASHBOARD_CONTAINER_WIDTH }}
      >
        <ProfileWithImage />
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

const ProfileWithImage = () => {
  const [meData] = useMe();
  const clinicId = useStore((state) => state.pickedClinicId);
  const [myMembers] = useGetMyMembers();
  const position = myMembers?.find((member) => member.clinic.id === clinicId)
    ?.manager
    ? '관리자'
    : '직원';

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-2 h-20 w-20 overflow-hidden rounded-full bg-gray-200">
        <User className="position-center-x absolute top-3 h-full w-4/6 fill-white stroke-white" />
      </div>
      <div className="text-base">
        <span className="mr-1">{position}</span>
        <span>{meData?.name}</span>
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
