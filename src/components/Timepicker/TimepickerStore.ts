import { createContext } from 'react';
import type { HourAndMinute } from '../../types/common.types';
import type { CloseAction } from '../../types/props.types';

interface TimepickerContextProps extends CloseAction {
  selectionTime: HourAndMinute;
  setHours: (number: number) => void;
  setMinutes: (number: number) => void;
}

export const TimepickerContext = createContext<TimepickerContextProps>({
  selectionTime: { hour: 0, minute: 0 },
  setMinutes() {},
  setHours() {},
  closeAction() {},
});
