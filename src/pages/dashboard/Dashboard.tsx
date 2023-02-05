import { useReactiveVar } from '@apollo/client';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import { clinicListsVar, loggedInUserVar } from '../../store';
import { useWindowSize } from '../../hooks';
import { ClinicsOfClient } from '../../models';
import { cls } from '../../utils/common.utils';
import { BrokenLine, Heart, Medicine } from '../../svgs';

const Dashboard = () => {
  useReactiveVar(clinicListsVar); // 리렌더 위한 선언
  const { width } = useWindowSize(true);
  const outletWidth = width - 200;
  return (
    <div className="flex text-base" style={{ width }}>
      <div className="css_dashboard__column-container">
        <ProfileWithImage />
        <MenuContainer />
      </div>
      <Outlet context={{ outletWidth }} />
    </div>
  );
};

const ProfileWithImage = () => {
  const loggedInUser = useReactiveVar(loggedInUserVar);

  return (
    <div className="flex flex-col items-center">
      <img
        alt="프로필 사진"
        className="mb-2 h-20 w-20 rounded-full bg-gray-200"
      />
      <div className="text-base">
        <span className="mr-1">
          {ClinicsOfClient.getSelectedClinic().position}
        </span>
        <span>{loggedInUser?.name}</span>
      </div>
    </div>
  );
};

const MenuContainer = () => {
  const { pathname } = useLocation();
  return (
    <div className="flex flex-col text-sm">
      <LinkButton
        path="/dashboard/clinic/members"
        isActivate={pathname.startsWith('/dashboard/clinic/members')}
      >
        <Heart />
        직원열람 및 관리
      </LinkButton>
      <LinkButton
        path="/dashboard/clinic/prescriptions"
        isActivate={pathname.startsWith('/dashboard/clinic/prescriptions')}
      >
        <Medicine />
        처방등록 및 관리
      </LinkButton>
      <LinkButton
        path="/dashboard/clinic/statistics"
        isActivate={pathname.startsWith('/dashboard/clinic/statistics')}
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

export default Dashboard;
