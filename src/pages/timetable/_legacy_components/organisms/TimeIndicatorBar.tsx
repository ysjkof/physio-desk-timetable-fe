import { useEffect, useState } from 'react';
import {
  TABLE_CELL_HEIGHT,
  TABLE_TIME_GAP,
} from '../../../../constants/constants';
import { TableTime } from '../../../../models/TableTime';
import { getTimeString } from '../../../../utils/date.utils';
import type { IsActive } from '../../../../types/common.types';

export default function TimeIndicatorBar({ isActive }: IsActive) {
  const { firstTimeInMinute, lastTimeInMinute } = TableTime;

  const [time, setTime] = useState(getTimeString(new Date()));
  const [top, setTop] = useState<number>();

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
      setTime(getTimeString(new Date(), true));
    }
  };

  const disable = top === 0 || typeof top !== 'number';

  useEffect(() => {
    if (disable) {
      return;
    }
    setPosition();
    const id = setInterval(setPosition, 30000);
    return () => clearInterval(id);
  }, []);

  if (disable) return <></>;

  return (
    <div className="time-indicator-bar" style={{ top: `${top}px` }}>
      {isActive && <span className="mx-auto">{time}</span>}
    </div>
  );
}
