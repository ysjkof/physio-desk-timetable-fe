import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useWindowSize } from '../../../hooks';
import { useStore } from '../../../store';
import type { TimetableTemplateProps } from '../../../types/propsTypes';

const TimetableTemplate = ({
  nav,
  columns,
  eventList,
}: TimetableTemplateProps) => {
  const isBigGlobalAside = useStore((state) => state.isBigGlobalAside);
  const isWeekCalendar = useStore((state) => state.isWeekCalendar);

  const { height, width, changeHeight, changeWidth } = useWindowSize(true);

  const navRef = useRef<HTMLDivElement>(null);
  const extraMargin = 20;

  useEffect(() => {
    if (!navRef.current) return;
    changeHeight(navRef.current.clientHeight);
    changeWidth();
  }, [isBigGlobalAside]);

  return (
    <motion.div animate={{ opacity: 1 }} id="timetable">
      <div id="timetable__nav" ref={navRef}>
        {nav}
      </div>
      <div
        id="timetable__main"
        style={{
          height: `${height - extraMargin}px`,
          width: `${width}px`,
        }}
      >
        <div id="timetable__schedules">{columns}</div>
        {!isWeekCalendar && (
          <div id="timetable__schedules-list">{eventList}</div>
        )}
      </div>
    </motion.div>
  );
};

export default TimetableTemplate;
