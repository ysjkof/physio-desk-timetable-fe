import { createContext } from 'react';
import { DateRange, PatientAtMessage } from '.';
import { startAndLastOfDay } from '../../../../../utils/dateUtils';

export const MessagesContext = createContext<{
  dateRange: DateRange;
  patient: PatientAtMessage | undefined;
  isNewMessage: boolean;
  pickPatient: (patient: PatientAtMessage) => void;
  toggleNewMessageAndResetPatient: () => void;
}>({
  dateRange: { value: startAndLastOfDay(new Date()), type: 'today' },
  patient: undefined,
  isNewMessage: true,
  pickPatient: () => {},
  toggleNewMessageAndResetPatient: () => {},
});
