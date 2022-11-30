import type { PropsWithChildren } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { cls } from '../../utils/common.utils';
import Logo from '../atoms/Logo';

interface GlobalNavigationBar extends PropsWithChildren {}

export default function GlobalNavigationBarLayout({
  children,
}: GlobalNavigationBar) {
  const location = useLocation();
  const pathname = location.pathname;

  const isTimetable = pathname.startsWith(ROUTES.timetable);
  const isDashboard = pathname.startsWith(ROUTES.dashboard);
  const isDocs = pathname.startsWith(ROUTES.docs);

  return (
    <header
      id="global-header"
      className={cls(
        'relative z-40 flex items-center bg-white px-10 transition-all duration-200',
        isTimetable || isDashboard ? 'py-2' : 'py-6',
        isDocs ? 'shadow-md' : '',
        isDashboard ? 'border-b' : ''
      )}
    >
      <Link to="/">
        <Logo />
      </Link>
      <div className="flex w-full items-center justify-end gap-3 sm:gap-6 sm:text-sm">
        {children}
      </div>
    </header>
  );
}
