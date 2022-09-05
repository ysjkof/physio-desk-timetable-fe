import { useReactiveVar } from '@apollo/client';
import { useState } from 'react';
import { TABLE_TIME_GAP } from '../../../constants/constants';
import {
  compareDateMatch,
  get4DigitHour,
  getTimeGaps,
  newDateFromHoursAndMinute,
  newDateSetHourAndMinute,
} from '../../../services/dateServices';
import { viewOptionsVar } from '../../../store';

export default function useViewoptions() {
  const viewOptions = useReactiveVar(viewOptionsVar);

  const [firstTime] = useState(() => {
    return newDateSetHourAndMinute({
      hour: viewOptions.tableDuration.start.hours,
      minute: viewOptions.tableDuration.start.minutes,
    });
  });
  const [lastTime] = useState(() => {
    return newDateSetHourAndMinute({
      hour: viewOptions.tableDuration.end.hours,
      minute: viewOptions.tableDuration.end.minutes,
    });
  });

  // get4DigitHour가 ISO Date String을 반환해서 로컬시각으로 표현되지 않는다
  // 그러니 화면 출력할 때 local time으로 변환해야한다
  const [labels, setLabels] = useState(
    getTimeGaps(
      viewOptions.tableDuration.start.hours,
      viewOptions.tableDuration.start.minutes,
      viewOptions.tableDuration.end.hours,
      viewOptions.tableDuration.end.minutes,
      TABLE_TIME_GAP
    ).map((label) => get4DigitHour(label))
  );

  const isChangeOption = () => {
    compareDateMatch(
      newDateFromHoursAndMinute(
        viewOptions.tableDuration.start.hours,
        viewOptions.tableDuration.start.minutes
      ),
      newDateFromHoursAndMinute(
        viewOptions.tableDuration.end.hours,
        viewOptions.tableDuration.end.minutes
      ),
      'hm'
    );
  };

  const getMinute = (date: Date) => {
    return date.getTime() / 1000 / 60;
  };
  const indicatorTimes = {
    firstTime: getMinute(firstTime),
    lastTime: getMinute(lastTime),
  };

  return { labels, setLabels, indicatorTimes };
}
