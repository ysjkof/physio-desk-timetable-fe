import { getHHMM } from '../../../services/dateServices';
import { compareNumAfterGetMinutes } from '../../../services/timetableServices';

interface TimeLabelsProps {
  labels: Date[];
}

export function TimeLabels({ labels }: TimeLabelsProps) {
  return (
    <>
      {labels.map((label, i) => (
        <div key={i} className={`h-[20px] w-full bg-white`}>
          {compareNumAfterGetMinutes(label, [0, 30]) && (
            <div className="relative -top-2 h-full">{getHHMM(label)}</div>
          )}
        </div>
      ))}
    </>
  );
}
