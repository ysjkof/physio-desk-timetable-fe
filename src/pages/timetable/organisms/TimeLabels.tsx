import { memo } from 'react';
import {
  getFrom4DigitTime,
  injectUTCTime,
} from '../../../services/dateServices';

interface TimeLabelsProps {
  labels: string[];
}

function TimeLabels({ labels }: TimeLabelsProps) {
  const checkMatchString = (date: string, minutes: string[]): boolean => {
    const targetMinute = getFrom4DigitTime(date, 'minute');
    return minutes.includes('' + targetMinute);
  };

  return (
    <>
      {labels.map((label, i) => {
        const hour = getFrom4DigitTime(label, 'hour');
        const minute = getFrom4DigitTime(label, 'minute');
        return (
          <div key={i} className={`h-[20px] w-full bg-white`}>
            {checkMatchString(label, ['00', '30']) && (
              <div className="relative -top-2 h-full">
                {injectUTCTime({ hour, minute, UTC: 'kor' })}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export default memo(TimeLabels);
