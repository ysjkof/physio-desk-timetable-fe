import { useMemo, useState } from 'react';
import { TimepickerContext } from './TimepickerStore';
import { TimepickerMain } from './TimepickerMain';
import { TimepickerButtons } from './TimepickerButtons';
import type { CloseAction } from '../../types/propsTypes';
import type { HoursAndMinutes } from '../../types/commonTypes';

interface TimepickerProps extends CloseAction {
  setTime: (args: HoursAndMinutes) => void;
}

export const Timepicker = ({ closeAction, setTime }: TimepickerProps) => {
  const [selectionTime, setSelectionTime] = useState({ hours: 9, minutes: 0 });

  const setHours = (hours: number) => {
    setSelectionTime((prev) => ({ ...prev, hours }));
    setTime({ hours });
  };

  const setMinutes = (minutes: number) => {
    setSelectionTime((prev) => ({ ...prev, minutes }));
    setTime({ minutes });
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
