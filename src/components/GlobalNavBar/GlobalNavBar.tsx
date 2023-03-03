import { useEffect, type PropsWithChildren, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { cls } from '../../utils/commonUtils';
import Logo from '../Logo';

function GlobalNavBar() {
  return (
    <Layout>
      <Menu />
    </Layout>
  );
}

const Layout = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const { pathname } = location;

  const isDocs = pathname.startsWith(ROUTES.docs);

  const [scrollAtTop, SetScrollAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        SetScrollAtTop(false);
      } else {
        SetScrollAtTop(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.addEventListener('scroll', handleScroll);
    };
  });

  return (
    <header
      id="global-header"
      className={cls(
        'sticky top-0 z-40 flex items-center justify-center bg-white py-6 transition-all duration-200',
        isDocs ? 'shadow-md' : scrollAtTop ? '' : 'shadow-md'
      )}
    >
      <div className="flex w-full max-w-screen-xl items-center px-4">
        <Link to="/" className="flex items-baseline gap-2">
          <Logo className="h-8" />
          <span className="text-xl font-bold">Muool</span>
        </Link>
        <div className="flex w-full items-center justify-end gap-6">
          {children}
        </div>
      </div>
    </header>
  );
};

const Menu = () => {
  return (
    <>
      <Link to="login">
        <span className="whitespace-nowrap">로그인</span>
      </Link>
      <Link to="sign-up">
        <span className="whitespace-nowrap">회원가입</span>
      </Link>
    </>
  );
};

export default GlobalNavBar;
