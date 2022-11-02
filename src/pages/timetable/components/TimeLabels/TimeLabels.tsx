import { memo } from 'react';
import { SHOW_MINUTES } from '../../../../constants/constants';
import { TimeLabel } from '../../../../models';

interface TimeLabelsProps {
  labels: string[];
}

function TimeLabels({ labels }: TimeLabelsProps) {
  const getTimeLabels = (_labels: string[]) =>
    _labels.map((label) => new TimeLabel(label, SHOW_MINUTES));

  const timeLabels = getTimeLabels(labels);

  return (
    <>
      {timeLabels.map((labelClass, i) => {
        return (
          <div key={i} className="h-[20px] w-full bg-white">
            {labelClass.getIsShow() && (
              <span
                className="relative -top-2 h-full font-bold"
                style={{ color: labelClass.getColor() }}
              >
                {labelClass.label}
              </span>
            )}
          </div>
        );
      })}
    </>
  );
}

export default memo(TimeLabels);
