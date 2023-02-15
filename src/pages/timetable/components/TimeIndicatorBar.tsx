import { useEffect, useState } from 'react';
import {
  TABLE_CELL_HEIGHT,
  TABLE_TIME_GAP,
} from '../../../constants/constants';
import { TimeDurationOfTimetable } from '../../../models';
import { getStringOfTime } from '../../../utils/dateUtils';
import type { IsActive } from '../../../types/commonTypes';

export default function TimeIndicatorBar({ isActive }: IsActive) {
  const firstTimeInMinute = TimeDurationOfTimetable.getFirstTimeInMinute();
  const lastTimeInMinute = TimeDurationOfTimetable.getLastTimeInMinute();

  const [time, setTime] = useState('');
  const [top, setTop] = useState(0);

  const setPosition = () => {
    const nowMinute = Date.now() / 1000 / 60; // 현재 시각을 분으로 변환
    const nowTime = nowMinute - firstTimeInMinute;
    const maxTime = lastTimeInMinute - firstTimeInMinute;
    if (nowTime > maxTime) {
      //  시간표의 1칸은 10분을 나타내고 높이 20px이다.
      //  1분은 2px기 때문에 *2 한다.
      setTop(0);
    } else {
      setTop(Math.floor((nowTime / TABLE_TIME_GAP) * TABLE_CELL_HEIGHT));

      if (!isActive) return;

      setTime(getStringOfTime(new Date(), true));
    }
  };

  const disable = top === 0 || typeof top !== 'number';

  useEffect(() => {
    setPosition();
    if (disable) {
      return;
    }
    const id = setInterval(setPosition, 30_000);
    return () => clearInterval(id);
  }, []);

  if (disable) return <></>;

  return (
    <div className="time-indicator-bar" style={{ top: `${top}px` }}>
      {isActive && <span className="mx-auto">{time}</span>}
    </div>
  );
}
