import { motion } from 'framer-motion';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface ITimetableProps {
  nav: ReactNode;
  labels: ReactNode;
  columns: ReactNode;
}

export const TimetableTemplate = ({
  nav,
  labels,
  columns,
}: ITimetableProps) => {
  const [height, setHeight] = useState<null | number>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      let timer: NodeJS.Timeout | false = false;
      const headerHeight = headerRef.current.clientHeight;
      function handleTableHeight() {
        const HEADER_HEIGHT = 41;
        const windowHeight = window.innerHeight;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          setHeight(windowHeight - headerHeight - HEADER_HEIGHT);
        }, 200);
      }
      handleTableHeight();
      window.addEventListener('resize', handleTableHeight);
      return () => window.removeEventListener('resize', handleTableHeight);
    }
  }, []);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="TIMETABLE_TEMPLATE h-full opacity-0"
    >
      <div
        className="TABLE_HEADER table-header relative z-[34] flex flex-col border-b bg-white"
        ref={headerRef}
      >
        {nav}
      </div>

      {height && (
        <div
          className="TABLE_BODY grid h-screen w-full grid-cols-[40px,1fr] overflow-scroll"
          style={{ height: height + 'px' }}
        >
          <div className="TABLE_LABELS sticky left-0 z-[32] border-r-2 border-black bg-white pt-[47px]">
            {labels}
          </div>
          <div className="TABLE_MAIN flex flex-col">{columns}</div>
        </div>
      )}
    </motion.div>
  );
};
