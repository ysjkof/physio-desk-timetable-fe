import { memo } from 'react';
import { SHOW_MINUTES } from '../../../../constants/constants';
import { TimeLabel } from '../../../../models';
import type { TimeLabelsProps } from '../../../../types/props.types';

function TimeLabels({ labels }: TimeLabelsProps) {
  const getTimeLabels = (_labels: string[]) =>
    _labels.map((label) => new TimeLabel(label, SHOW_MINUTES));

  const timeLabels = getTimeLabels(labels);

  return (
    <>
      {timeLabels.map((label, i) => {
        return (
          <div key={i} className="h-[20px] bg-white pr-2 pl-4">
            {label.isShow && (
              <span
                className="relative -top-2 h-full font-bold"
                style={{ color: label.color }}
              >
                {label.value}
              </span>
            )}
          </div>
        );
      })}
    </>
  );
}

export default memo(TimeLabels);
