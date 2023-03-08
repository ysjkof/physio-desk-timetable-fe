import { Suspense, type PropsWithChildren } from 'react';
import Toast from '../Toast';
import Confirm from '../Confirm';
import Alert from '../Alert';
import Loading from '../Loading';

function GlobalLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Suspense fallback={<Loading />}>{children}</Suspense>
      <Toast />
      <Confirm />
      <Alert />
    </>
  );
}

export default GlobalLayout;
