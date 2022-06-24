import { motion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

interface ITimetableProps {
  header: ReactNode;
  labels: ReactNode;
  body: ReactNode;
}

export const TimetableTemplate = ({
  header,
  labels,
  body,
}: ITimetableProps) => {
  const [height, setBodyHeight] = useState<null | number>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const HEADER_HEIGHT = 41;
    if (headerRef.current) {
      const headerHeight = headerRef.current.clientHeight;
      const windowHeight = window.innerHeight;
      setBodyHeight(windowHeight - headerHeight - HEADER_HEIGHT);
    }
  }, [headerRef]);
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="TIMETABLE_TEMPLATE h-full opacity-0"
    >
      <div
        className="TABLE_HEADER table-header relative z-[34] flex flex-col bg-white shadow-b"
        ref={headerRef}
      >
        {header}
      </div>

      {height && (
        <div
          className="TABLE_BODY grid h-screen w-full grid-cols-[40px,1fr] overflow-scroll"
          style={{ height: height + "px" }}
        >
          <div className="TABLE_LABELS sticky left-0 z-30 border-r-2 border-black bg-white pt-[44px]">
            {labels}
          </div>
          <div className="TABLE_MAIN flex h-screen flex-col">{body}</div>
        </div>
      )}
    </motion.div>
  );
};
