import { useEffect, useState } from 'react';
import {
  TABLE_CELL_HEIGHT,
  TABLE_TIME_GAP,
} from '../../../../constants/constants';
import { getTimeString } from '../../../../services/dateServices';
import useViewoptions from '../../hooks/useViewOption';

interface ITimeIndicatorBarProps {
  isActive: boolean;
}

export default function TimeIndicatorBar({ isActive }: ITimeIndicatorBarProps) {
  const {
    indicatorTimes: { firstTime, lastTime },
  } = useViewoptions();

  const [time, setTime] = useState(getTimeString(new Date()));
  const [top, setTop] = useState<number>();

  const setPosition = () => {
    const nowMinute = Date.now() / 1000 / 60; // 현재 시각을 분으로 변환
    const nowTime = nowMinute - firstTime;
    const maxTime = lastTime - firstTime;
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

  useEffect(() => {
    setPosition();
    let id = setInterval(setPosition, 30000);
    return () => clearInterval(id);
  }, []);
  if (top === 0 || typeof top !== 'number') return <></>;
  return (
    <div className="time-indicator-bar" style={{ top: `${top}px` }}>
      {isActive && <span className="mx-auto">{time}</span>}
    </div>
  );
}
