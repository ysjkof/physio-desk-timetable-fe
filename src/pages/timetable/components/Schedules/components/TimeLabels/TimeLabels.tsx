import { memo } from 'react';
import {
  LABEL_COLORS,
  LABEL_VISIBLE_MINUTES,
} from '../../../../../../constants/constants';
import { TimeLabel } from '../../../../../../models';
import { useTableLabel } from '../../../../hooks';

const TimeLabels = () => {
  const { labels } = useTableLabel();

  const getTimeLabels = (_labels: string[]) =>
    _labels.map(
      (label) =>
        new TimeLabel({
          label,
          visibleMinute: LABEL_VISIBLE_MINUTES,
          colors: LABEL_COLORS,
        })
    );

  const timeLabels = getTimeLabels(labels);

  return (
    <div id="schedules__time-label">
      <div className="h-20 border-r-2 border-gray-400" />
      {timeLabels.map((label, i) => {
        return (
          <div
            key={i}
            className="h-[20px] border-r-2 border-gray-400 bg-white pr-2 pl-4"
          >
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
    </div>
  );
};

export default memo(TimeLabels);
