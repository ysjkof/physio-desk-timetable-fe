import { useEffect, useRef, useState } from 'react';
import BarBottomLeft from '../../svgs/BarBottomLeft';
import XMark from '../../svgs/XMark';
import DocsSidebarModal from './components/molecules/DocsSidebarModal';
import DocsSidebar from './components/organisms/DocsSidebar';
import { Outlet } from 'react-router-dom';
import { Loading } from '../../components/atoms/Loading';
import useMediaQuery from '../../hooks/useMediaQuery';
import useWindowSize from '../../hooks/useWindowSize';

export default function Docs() {
  const [isOpen, setOpen] = useState(false);

  const { isMobile, loading } = useMediaQuery();

  const { height, changeMinus } = useWindowSize(true);
  const navRef = useRef<HTMLDivElement>(null);

  const toggleAside = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!navRef.current) return changeMinus(0);

    const { clientHeight } = navRef.current;
    changeMinus(clientHeight);
  }, [isMobile]);

  if (loading) return <Loading />;

  return (
    <main className="h-full bg-gray-50">
      {isMobile && (
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
        {!isMobile && <DocsSidebar />}
        {isMobile && isOpen && (
          <DocsSidebarModal toggleAside={toggleAside}>
            <DocsSidebar />
          </DocsSidebarModal>
        )}
        <article className="prose flex h-full w-full max-w-3xl flex-col overflow-y-scroll bg-white px-6 pt-2 pb-20 prose-a:no-underline sm:px-14 sm:pt-4 sm:pb-28">
          <Outlet />
        </article>
      </div>
    </main>
  );
}
