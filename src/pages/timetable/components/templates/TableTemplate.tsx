import { motion } from 'framer-motion';
import { ReactNode, useEffect, useRef } from 'react';
import useWindowSize from '../../../../hooks/useWindowSize';

interface TableTemplateProps {
  nav: ReactNode;
  labels: ReactNode;
  columns: ReactNode;
}

export const TableTemplate = ({ nav, labels, columns }: TableTemplateProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const { height, setMinus } = useWindowSize();

  useEffect(() => {
    if (!headerRef.current) return;
    setMinus(headerRef.current.clientHeight);
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
      <div
        className="TABLE_BODY grid h-screen w-full grid-cols-[40px,1fr] overflow-scroll"
        style={{ height: height + 'px' }}
      >
        <div className="TABLE_LABELS sticky left-0 z-[32] border-r-2 border-black bg-white pt-[47px]">
          {labels}
        </div>
        <div className="TABLE_MAIN flex flex-col">{columns}</div>
      </div>
      {/* )} */}
    </motion.div>
  );
};
