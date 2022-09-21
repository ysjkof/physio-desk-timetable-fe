import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import DocsSidebar from './components/organisms/DocsSidebar';
import useMediaQuery from '../../hooks/useMediaQuery';
import useWindowSize from '../../hooks/useWindowSize';
import BarBottomLeft from '../../svgs/BarBottomLeft';
import XMark from '../../svgs/XMark';
import { cls } from '../../utils/utils';

const DocsSidebarModal = lazy(
  () => import('./components/molecules/DocsSidebarModal')
);
const Loading = lazy(() => import('../../components/atoms/Loading'));

export default function Docs() {
  const [isOpen, setOpen] = useState(false);
  const [isDesktop, loading] = useMediaQuery({ minWidth: '768' });

  const isOverview = useMatch('docs/overview');

  const { height, changeMinus } = useWindowSize(true);
  const navRef = useRef<HTMLDivElement>(null);

  const toggleAside = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!navRef.current) return changeMinus(0);

    const { clientHeight } = navRef.current;
    changeMinus(clientHeight);
  }, [isDesktop]);

  if (loading) return <Loading />;

  return (
    <main className="h-full bg-gray-50">
      {isDesktop && (
        <nav className="flex h-12 items-center px-4 shadow-md" ref={navRef}>
          <button type="button" className="p-2" onClick={toggleAside}>
            {isOpen ? <XMark /> : <BarBottomLeft />}
          </button>
        </nav>
      )}

      <div
        className="mx-auto flex max-w-7xl justify-center overflow-hidden"
        style={{ height }}
      >
        {!isDesktop && <DocsSidebar />}
        {isDesktop && isOpen && (
          <DocsSidebarModal toggleAside={toggleAside}>
            <DocsSidebar />
          </DocsSidebarModal>
        )}
        <article
          className={cls(
            'prose relative flex h-full w-full max-w-3xl flex-col overflow-y-scroll bg-white pt-2 pb-20 prose-a:no-underline sm:pt-4 sm:pb-28',
            isOverview ? '' : 'px-6 md:px-16'
          )}
        >
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </article>
      </div>
    </main>
  );
}
