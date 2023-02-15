import { createContext } from 'react';
import type { HoursAndMinutes } from '../../types/commonTypes';
import type { CloseAction } from '../../types/propsTypes';

interface TimepickerContextProps extends CloseAction {
  selectionTime: HoursAndMinutes;
  setHours: (number: number) => void;
  setMinutes: (number: number) => void;
}

export const TimepickerContext = createContext<TimepickerContextProps>({
  selectionTime: { hours: 0, minutes: 0 },
  setMinutes() {},
  setHours() {},
  closeAction() {},
});
