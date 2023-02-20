import { Link, Outlet, useLocation } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useStore } from '../../store';
import { useFindMyMembers, useMe, useWindowSize } from '../../hooks';
import { cls } from '../../utils/commonUtils';
import { BrokenLine, Heart, Medicine, User } from '../../svgs';
import { ClinicSelector } from '../../components';

const Dashboard = () => {
  const { width } = useWindowSize(true);
  return (
    <div className="flex text-base" style={{ width }}>
      <div className="css_dashboard__column-container">
        <ProfileWithImage />
        <LinkBtns />
      </div>
      <div className="flex w-full flex-col divide-y">
        <ClinicSelector />
        <Outlet />
      </div>
    </div>
  );
};

const ProfileWithImage = () => {
  const [meData] = useMe();
  const clinicId = useStore((state) => state.pickedClinicId);
  const [myMembers] = useFindMyMembers();
  const position = myMembers?.find((member) => member.clinic.id === clinicId)
    ?.manager
    ? '관리자'
    : '직원';

  const profileImageUrl = 'maybe-profile-image.png';

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-2 h-20 w-20 overflow-hidden rounded-full bg-gray-200">
        <img
          src={profileImageUrl}
          className="position-center absolute z-10 h-full w-full bg-white bg-cover p-3"
          alt="프로필 사진"
          onError={(event) => {
            // eslint-disable-next-line no-param-reassign
            event.currentTarget.style.display = 'none';
          }}
        />
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
        isActivate={
          pathname.startsWith('/dashboard/clinic/members') &&
          !pathname.endsWith('/invite')
        }
      >
        <Heart />
        직원열람 및 관리
      </LinkButton>
      <LinkButton
        path="/dashboard/clinic/members/invite"
        isActivate={pathname.startsWith('/dashboard/clinic/members/invite')}
      >
        <FontAwesomeIcon icon={faPlus} fontSize="1rem" />
        직원초대
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
