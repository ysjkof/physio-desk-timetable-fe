import { useMemo, useState } from 'react';
import { TimepickerContext } from './TimepickerStore';
import { TimepickerMain } from './TimepickerMain';
import { TimepickerButtons } from './TimepickerButtons';
import type { CloseAction } from '../../types/props.types';
import type { HourAndMinute } from '../../types/common.types';

interface TimepickerProps extends CloseAction {
  setTime: (args: HourAndMinute) => void;
}

export const Timepicker = ({ closeAction, setTime }: TimepickerProps) => {
  const [selectionTime, setSelectionTime] = useState({ hour: 9, minute: 0 });

  const setHours = (hour: number) => {
    setSelectionTime((prev) => ({ ...prev, hour }));
    setTime({ hour });
  };

  const setMinutes = (minute: number) => {
    setSelectionTime((prev) => ({ ...prev, minute }));
    setTime({ minute });
  };

  const value = useMemo(
    () => ({
      selectionTime,
      setHours,
      setMinutes,
      closeAction,
    }),
    [selectionTime]
  );

  return (
    <TimepickerContext.Provider value={value}>
      <div className="datepicker__calendar-body z-50">
        <div className="flex w-full flex-col rounded-md border bg-white pt-2">
          <TimepickerMain />
          <TimepickerButtons />
        </div>
      </div>
    </TimepickerContext.Provider>
  );
};
