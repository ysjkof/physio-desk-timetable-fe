import { cls } from '../../../../utils/utils';
import TimeIndicatorBar from '../../_legacy_components/organisms/TimeIndicatorBar';
import type { PropsWithChildren } from 'react';

interface ScheduleBoxProps extends PropsWithChildren {
  userLength: number;
  enableTimeIndicator: boolean;
  viewPeriodStyle: { gridTemplateColumns: string };
}

function ScheduleBox({
  children,
  userLength,
  enableTimeIndicator,
  viewPeriodStyle,
}: ScheduleBoxProps) {
  return (
    <div
      className={cls(
        'USER_COLS relative grid border-b',
        userLength === 1 ? 'border-x-inherit' : ''
      )}
      style={viewPeriodStyle}
    >
      <TimeIndicatorBar isActive={enableTimeIndicator} />
      {children}
    </div>
  );
}

export default ScheduleBox;
