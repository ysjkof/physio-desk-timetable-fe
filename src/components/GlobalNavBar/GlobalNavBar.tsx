import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import GlobalNavBarLayout from './GlobalNavBarLayout';

function GlobalNavBar() {
  return (
    <GlobalNavBarLayout>
      <Menu />
    </GlobalNavBarLayout>
  );
}

const Menu = () => {
  return (
    <>
      <Link to={ROUTES.docs}>
        <span className="whitespace-nowrap">문서</span>
      </Link>
      <Link to={ROUTES.login}>
        <span className="whitespace-nowrap">로그인/회원가입</span>
      </Link>
    </>
  );
};

export default GlobalNavBar;
