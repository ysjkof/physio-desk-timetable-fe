import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ENDPOINT } from '../../router/routerConstants';

export const Account = () => {
  const location = useLocation();

  return (
    <div className="mt-10 flex h-screen flex-col items-center lg:mt-28">
      <div className="flex w-full max-w-screen-sm flex-col items-center px-5">
        {/* <Link to="/">
     <img alt="Muool" src={muoolLogo} className="mb-5 w-80" />
    </Link> */}
        <Outlet />

        <NavLink
          to={ENDPOINT.signUp}
          className={
            location.pathname === '/create-account'
              ? 'font-bold text-sky-500 hover:underline'
              : 'text-sky-500 opacity-50 hover:underline'
          }
        >
          <span className="">계정이 없습니까? </span>
          회원가입
        </NavLink>

        <NavLink
          to={ENDPOINT.signIn}
          className={
            location.pathname === '/'
              ? 'font-bold text-sky-500 hover:underline'
              : 'text-sky-500 opacity-50 hover:underline'
          }
        >
          <span className="">이미 계정이 있습니까? </span>
          로그인
        </NavLink>
      </div>
    </div>
  );
};
