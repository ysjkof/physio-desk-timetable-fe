import { Link, Outlet, useLocation } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import { useMe, useWindowSize } from '../../hooks';
import { cls } from '../../utils/commonUtils';
import { Building, BuildingPlus, User } from '../../svgs';

const Setting = () => {
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
  const [meData] = useMe();

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
        <span>{meData?.name}</span>
      </div>
    </div>
  );
};

const MenuContainer = () => {
  const { pathname } = useLocation();
  return (
    <div className="flex flex-col text-sm">
      <LinkButton
        path="/setting/my-info"
        isActivate={pathname.startsWith('/setting/my-info')}
      >
        <User />
        나의 정보
      </LinkButton>
      <LinkButton
        path="/setting/my-clinics"
        isActivate={pathname.startsWith('/setting/my-clinics')}
      >
        <Building />
        나의 병원
      </LinkButton>
      <LinkButton
        path="/setting/clinic/create"
        isActivate={pathname.startsWith('/setting/clinic/create')}
      >
        <BuildingPlus />
        병원 만들기
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

export default Setting;
