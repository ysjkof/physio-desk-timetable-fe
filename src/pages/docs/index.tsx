import { useEffect, useState } from 'react';
import BarBottomLeft from '../../svgs/BarBottomLeft';
import XMark from '../../svgs/XMark';
import DocsSidebarModal from './components/molecules/DocsSidebarModal';
import DocsSidebar from './components/organisms/DocsSidebar';
import { Outlet } from 'react-router-dom';

export default function Docs() {
  const [isOpen, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia('(min-width:640px)');
    if (mql.matches) setIsMobile(false);

    mql.onchange = (event) => {
      if (event.matches) {
        if (mql.matches) setIsMobile(false);
        /* the viewport is 600 pixels wide or less */
        console.log('큰 화면 - more than 640px wide.');
      } else {
        // setOpen(false);
        setIsMobile(true);
        /* the viewport is more than 600 pixels wide */
        console.log('좁은 화면 — less than 640px wide.');
      }
    };
  }, []);

  const toggleAside = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div className="h-full">
      {isMobile && (
        <nav className="flex h-12 items-center px-4 shadow-md ">
          <button type="button" className="p-2" onClick={toggleAside}>
            {isOpen ? <XMark /> : <BarBottomLeft />}
          </button>
        </nav>
      )}

      <main
        className="flex overflow-hidden"
        style={{ height: 'calc(100% - 33px)' }}
      >
        {!isMobile && <DocsSidebar />}
        {isMobile && isOpen && (
          <DocsSidebarModal toggleAside={toggleAside}>
            <DocsSidebar />
          </DocsSidebarModal>
        )}
        <section className="flex flex-col overflow-y-scroll p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
