import { Link, Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SERVICE_NAME } from '../../../../constants/constants';
import { useWindowSize } from '../../../../hooks';
import { DASHBOARD } from '../../../../router/routes';

const MessagesManagement = () => {
  const { height } = useWindowSize(true);

  return (
    <>
      <Helmet title={`통계 | ${SERVICE_NAME.ko}`} />
      <div
        className="overflow-hidden whitespace-nowrap bg-[#F9F9FF] px-10"
        style={{ height }}
      >
        <div className="my-6 flex max-w-4xl items-center justify-between gap-6">
          <Header />
          <Navigation />
        </div>

        <div
          className="flex flex-col gap-6"
          style={{ height: 'calc(100% - ( 92px * 2 )' }}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MessagesManagement;

const Header = () => {
  return (
    <div className="flex items-baseline gap-2">
      <h1 className="dashboard-menu-title">문자메시지</h1>
    </div>
  );
};

const Navigation = () => {
  const { pathname } = useLocation();
  const isRoot = pathname.endsWith(DASHBOARD.messages.root);
  const isBooking = pathname.startsWith(
    DASHBOARD.messages.root + '/' + DASHBOARD.messages.booking
  );
  return (
    <div className="flex gap-x-6">
      <Link to="" className={isRoot ? 'font-bold' : ''}>
        <button>한 명에게 보내기</button>
      </Link>
      <Link
        to={DASHBOARD.messages.booking}
        className={isBooking ? 'font-bold' : ''}
      >
        <button>알림문자예약</button>
      </Link>
    </div>
  );
};
