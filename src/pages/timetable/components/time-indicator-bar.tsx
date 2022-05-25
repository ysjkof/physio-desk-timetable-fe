import { useEffect, useState } from "react";

interface ITimeIndicatorBarProps {
  labels: Date[];
}

export const TimeIndicatorBar = ({ labels }: ITimeIndicatorBarProps) => {
  const [top, setTop] = useState<number>();
  const startTime = labels[0].getTime() / 1000 / 60;
  const endTime = labels[labels.length - 1].getTime() / 1000 / 60;
  const setPosition = () => {
    const nowMinute = Date.now() / 1000 / 60;
    const nowTime = nowMinute - startTime;
    const maxTime = endTime - startTime;
    if (nowTime > maxTime) {
      //   시간표의 1칸은 10분을 나타내고 높이 20px이다.
      //   1분은 2px기 때문에 *2 한다.
      setTop(0);
    } else {
      setTop(Math.floor(nowTime * 2));
    }
  };
  useEffect(() => {
    setPosition();
    let id = setInterval(setPosition, 30000);
    return () => clearInterval(id);
  }, []);
  if (top === 0) return <></>;
  return (
    <div
      className="time-indicator-bar group absolute z-40 flex w-full border-t border-red-500 hover:z-50"
      style={{ top: `${top}px` }}
    >
      <span className="mx-auto text-red-500 group-hover:hidden">
        {new Date().toLocaleString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
};
