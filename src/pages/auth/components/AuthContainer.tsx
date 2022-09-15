import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from '../../../components/atoms/Logo';
import { ROUTES } from '../../../router/routes';

export default function AuthContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();

  return (
    <div className="mt-10 flex h-screen flex-col items-center lg:mt-28">
      <div className="flex w-full max-w-screen-sm flex-col items-center px-5">
        <Link className="mb-5" to="/">
          <Logo size={2} className="mb-6" />
        </Link>

        {children}

        <NavLink
          to={ROUTES.sign_up}
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
          to={ROUTES.login}
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
}
