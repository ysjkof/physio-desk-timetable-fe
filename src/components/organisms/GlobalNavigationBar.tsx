import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import Logo from '../atoms/Logo';

export const GlobalNavigationBar = () => {
  return (
    <>
      <header className="HEADER header" id="header">
        <div className="flex w-full items-center gap-10">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <div className="flex w-full items-center justify-end gap-6">
          <Link to={ROUTES.docs}>
            <span className="whitespace-nowrap">문서</span>
          </Link>
          <Link to={ROUTES.login}>
            <span className="whitespace-nowrap">로그인/회원가입</span>
          </Link>
        </div>
      </header>
    </>
  );
};
