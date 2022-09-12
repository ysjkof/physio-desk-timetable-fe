import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/routes';

export const GlobalNavigationBar = () => {
  return (
    <>
      <header className="HEADER header" id="header">
        <div className="flex w-full items-center gap-10">
          <Link to="/">
            {/* <img src={muoolLogo} className="w-36" alt="Muool" /> */}
            <span className="header-title">Muool</span>
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
