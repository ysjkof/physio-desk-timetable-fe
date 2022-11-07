import { ReactNode, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useWindowSize from '../../../../hooks/useWindowSize';

interface TableTemplateProps {
  aside: ReactNode;
  nav: ReactNode;
  labels: ReactNode;
  columns: ReactNode;
}

export default function TableTemplate({
  aside,
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
      className="grid h-full grid-cols-[11rem,1fr] grid-rows-[7rem,1fr] opacity-0"
    >
      <div id="timetable__aside-nav" className="col-span-1 row-span-2">
        {aside}
      </div>
      <div
        id="timetable__nav"
        className="relative z-[34] mt-4 flex w-full flex-col justify-between bg-white px-2"
        ref={headerRef}
      >
        {nav}
      </div>
      <div
        id="timetable__body"
        className="flex h-screen w-full overflow-scroll"
        style={{ height: height + 'px' }}
      >
        <div
          id="timetable__labels"
          className="sticky left-0 z-[32] bg-white px-4 pt-[47px]"
        >
          {labels}
        </div>
        <div id="timetable__columns">{columns}</div>
      </div>
    </motion.div>
  );
}
