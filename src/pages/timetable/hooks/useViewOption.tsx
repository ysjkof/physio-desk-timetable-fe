import { useReactiveVar } from '@apollo/client';
import { useEffect, useState } from 'react';
import { TABLE_TIME_GAP } from '../../../constants/constants';
import {
  compareDateMatch,
  createDate,
  get4DigitHour,
  getTimeGaps,
} from '../../../services/dateServices';
import { viewOptionsVar } from '../../../store';

export default function useViewOptions() {
  const viewOptions = useReactiveVar(viewOptionsVar);

  const [firstTime, setFirstTime] = useState(
    createDate(undefined, {
      hour: viewOptions.tableDuration.startHour,
      minute: viewOptions.tableDuration.startMinute,
    })
  );
  const [lastTime, setLastTime] = useState(
    createDate(undefined, {
      hour: viewOptions.tableDuration.endHour,
      minute: viewOptions.tableDuration.endMinute,
    })
  );

  // get4DigitHour가 ISO Date String을 반환해서 로컬시각으로 표현되지 않는다
  // 그러니 화면 출력할 때 local time으로 변환해야한다
  const [labels, setLabels] = useState(
    getTimeGaps(
      viewOptions.tableDuration.startHour,
      viewOptions.tableDuration.startMinute,
      viewOptions.tableDuration.endHour,
      viewOptions.tableDuration.endMinute,
      TABLE_TIME_GAP
    ).map((label) => get4DigitHour(label))
  );

  const getMinute = (date: Date) => {
    return date.getTime() / 1000 / 60;
  };
  const indicatorTimes = {
    firstTime: getMinute(firstTime),
    lastTime: getMinute(lastTime),
  };

  useEffect(() => {
    const newFirstTime = createDate(undefined, {
      hour: viewOptions.tableDuration.startHour,
      minute: viewOptions.tableDuration.startMinute,
    });
    const isMatchFirstTime = compareDateMatch(firstTime, newFirstTime, 'hm');

    const newLastTime = createDate(undefined, {
      hour: viewOptions.tableDuration.endHour,
      minute: viewOptions.tableDuration.endMinute,
    });
    const isMatchLastTime = compareDateMatch(lastTime, newLastTime, 'hm');

    if (!isMatchFirstTime) {
      setFirstTime(newFirstTime);
    }
    if (!isMatchLastTime) {
      setLastTime(newLastTime);
    }
  }, [viewOptions]);

  useEffect(() => {
    setLabels(
      getTimeGaps(
        viewOptions.tableDuration.startHour,
        viewOptions.tableDuration.startMinute,
        viewOptions.tableDuration.endHour,
        viewOptions.tableDuration.endMinute,
        TABLE_TIME_GAP
      ).map((label) => get4DigitHour(label))
    );
  }, [firstTime, lastTime]);

  return { labels, setLabels, indicatorTimes };
}
