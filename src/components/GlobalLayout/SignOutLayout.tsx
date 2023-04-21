import { Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';
import { GlobalNavBar } from '../GlobalNavBar';
import { GlobalFooter } from '../GlobalFooter';

const Loading = lazy(() => import('../Loading'));

const SignOutLayout = () => {
  return (
    <div className="flex h-full flex-col justify-between">
      <GlobalNavBar />
      <Suspense fallback={<Loading />}>
        <main className="grow">
          <Outlet />
        </main>
        <GlobalFooter />
      </Suspense>
    </div>
  );
};

export default SignOutLayout;
