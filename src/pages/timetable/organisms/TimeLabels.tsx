import { memo } from 'react';
import { getHHMM } from '../../../services/dateServices';
import { checkMatchMinute } from '../../../services/timetableServices';

interface TimeLabelsProps {
  labels: Date[];
}

function TimeLabels({ labels }: TimeLabelsProps) {
  return (
    <>
      {labels.map((label, i) => (
        <div key={i} className={`h-[20px] w-full bg-white`}>
          {checkMatchMinute(label, [0, 30]) && (
            <div className="relative -top-2 h-full">{getHHMM(label)}</div>
          )}
        </div>
      ))}
    </>
  );
}

export default memo(TimeLabels);
