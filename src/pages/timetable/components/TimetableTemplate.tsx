import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useWindowSize } from '../../../hooks';
import { cls } from '../../../utils/common.utils';
import { useTableDisplay } from '../hooks';
import type { TimetableTemplateProps } from '../../../types/props.types';

const TimetableTemplate = ({
  aside,
  nav,
  labels,
  columns,
}: TimetableTemplateProps) => {
  const {
    tableDisplay: { asideExtension },
  } = useTableDisplay();

  const { height, width, changeHeight, changeWidth } = useWindowSize(true);
  const navRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLDivElement>(null);
  const extraMargin = 20;

  useEffect(() => {
    if (!navRef.current || !asideRef.current) return;
    changeHeight(navRef.current.clientHeight);
    changeWidth(asideRef.current.clientWidth);
  }, [asideExtension]);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      id="timetable__template"
      className={cls('flex h-full w-full opacity-0')}
    >
      <div id="timetable__aside-nav" ref={asideRef}>
        {aside}
      </div>
      <div className="basis-full">
        <div
          id="timetable__nav"
          className="relative z-[34] mt-4 flex w-full flex-col  justify-between bg-white px-2"
          ref={navRef}
        >
          {nav}
        </div>
        <div
          id="timetable__body"
          className="flex overflow-scroll"
          style={{
            height: `${height - extraMargin}px`,
            width: `${width}px`,
          }}
        >
          <div
            id="timetable__labels"
            className="sticky left-0 z-[32] bg-white pt-[73px]"
          >
            {labels}
          </div>
          <div id="timetable__columns">{columns}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default TimetableTemplate;
