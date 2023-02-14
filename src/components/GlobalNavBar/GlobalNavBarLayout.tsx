import type { PropsWithChildren } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { cls } from '../../utils/common.utils';
import LogoOfText from '../LogoOfText';

export default function GlobalNavBarLayout({ children }: PropsWithChildren) {
  const location = useLocation();
  const { pathname } = location;

  const isDocs = pathname.startsWith(ROUTES.docs);

  return (
    <header
      id="global-header"
      className={cls(
        'relative z-40 flex items-center bg-white px-10 py-6 transition-all duration-200',
        isDocs ? 'shadow-md' : ''
      )}
    >
      <Link to="/">
        <LogoOfText />
      </Link>
      <div className="flex w-full items-center justify-end gap-3 sm:gap-6 sm:text-sm">
        {children}
      </div>
    </header>
  );
}
