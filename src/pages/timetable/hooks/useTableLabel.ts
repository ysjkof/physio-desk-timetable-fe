import { useEffect, useState } from 'react';
import { TimeDurationOfTimetable } from '../../../models/TimeDurationOfTimetable';
import { useStore } from '../../../store';
import type { TableTimeOptions } from '../../../types/common.types';

export const useTableLabel = () => {
  const timeDurationOptions = useStore(
    (state) => state.timeDurationOfTimetable
  );

  // get4DigitHour가 ISO Date String을 반환해서 로컬시각으로 표현되지 않는다
  // 그러니 화면 출력할 때 local time으로 변환해야한다
  const [labels, setLabels] = useState(TimeDurationOfTimetable.getLabels());

  const changeTableTimeOptions = (options: TableTimeOptions) => {
    TimeDurationOfTimetable.set(options);
  };

  const changeLabels = () => {
    setLabels(TimeDurationOfTimetable.getLabels());
  };

  useEffect(() => {
    changeTableTimeOptions(timeDurationOptions);
    changeLabels();
  }, [timeDurationOptions]);

  return { labels };
};
