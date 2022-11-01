import { motion } from 'framer-motion';
import { ReactNode, useEffect, useRef } from 'react';
import useWindowSize from '../../../../hooks/useWindowSize';

interface TableTemplateProps {
  nav: ReactNode;
  labels: ReactNode;
  columns: ReactNode;
}

export default function TableTemplate({
  nav,
  labels,
  columns,
}: TableTemplateProps) {
  const { height, changeMinus } = useWindowSize(true);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;

    changeMinus(headerRef.current.clientHeight);
  }, []);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      id="timetable__template"
      className="h-full opacity-0"
    >
      <div
        id="timetable__nav"
        className="relative z-[34] flex w-full flex-col justify-between border-b bg-white px-2"
        ref={headerRef}
      >
        {nav}
      </div>
      <div
        id="timetable__body"
        className="grid h-screen w-full grid-cols-[40px,1fr] overflow-scroll"
        style={{ height: height + 'px' }}
      >
        <div
          id="timetable__labels"
          className="sticky left-0 z-[32] border-r-2 border-black bg-white pt-[47px]"
        >
          {labels}
        </div>
        <div id="timetable__columns" className="flex flex-col">
          {columns}
        </div>
      </div>
      {/* )} */}
    </motion.div>
  );
}
