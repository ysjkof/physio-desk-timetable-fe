import { useState } from 'react';
import BarBottomLeft from '../../svgs/BarBottomLeft';
import XMark from '../../svgs/XMark';
import DocsSidebarModal from './components/molecules/DocsSidebarModal';
import DocsSidebar from './components/organisms/DocsSidebar';
import { Outlet } from 'react-router-dom';
import { Loading } from '../../components/atoms/Loading';
import useMediaQuery from '../../hooks/useMediaQuery';

export default function Docs() {
  const [isOpen, setOpen] = useState(false);

  const { isMobile, loading } = useMediaQuery();

  const toggleAside = () => {
    setOpen((prev) => !prev);
  };

  if (loading) return <Loading />;

  return (
    <main className="h-full bg-gray-50">
      {isMobile && (
        <nav className="flex h-12 items-center px-4 shadow-md ">
          <button type="button" className="p-2" onClick={toggleAside}>
            {isOpen ? <XMark /> : <BarBottomLeft />}
          </button>
        </nav>
      )}

      <div
        className="mx-auto flex max-w-7xl justify-center overflow-hidden"
        style={{ height: 'calc(100% - 33px)' }}
      >
        {!isMobile && <DocsSidebar />}
        {isMobile && isOpen && (
          <DocsSidebarModal toggleAside={toggleAside}>
            <DocsSidebar />
          </DocsSidebarModal>
        )}
        <article className="prose flex w-full max-w-3xl flex-col overflow-y-scroll bg-white py-16 px-6 prose-a:no-underline sm:px-14">
          <Outlet />
        </article>
      </div>
    </main>
  );
}
