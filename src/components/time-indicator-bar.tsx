import React, { useEffect, useState } from "react";

interface ITimeIndicatorBarProps {
  labels: Date[];
}

export const TimeIndicatorBar: React.FC<ITimeIndicatorBarProps> = ({
  labels,
}) => {
  const [top, setTop] = useState<number>();
  const startTime = labels[0].getTime() / 1000 / 60;
  const endTime = labels[labels.length - 1].getTime() / 1000 / 60;
  const setPosition = () => {
    const nowMinute = Date.now() / 1000 / 60;
    const nowTime = nowMinute - startTime;
    const maxTime = endTime - startTime;
    if (nowTime < maxTime) {
      //   시간표의 1칸은 10분을 나타내고 높이 20px이다.
      //   1분은 2px기 때문에 *2 한다.
      setTop(Math.floor(nowTime * 2));
    } else {
      setTop(Math.floor(endTime));
    }
  };
  //   const savedCalllback = useRef(setPosition);
  useEffect(() => {
    setPosition();
    // function tick() {
    //   savedCalllback.current();
    // }
    // let id = setInterval(tick, 30000);
    let id = setInterval(setPosition, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="time-indicator-bar group absolute z-40 flex w-full border-t border-red-500 hover:z-50"
      style={{ top: `${top}px` }}
    >
      <span className="mx-auto hidden text-red-500 group-hover:block">
        {new Date().toLocaleString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
};
