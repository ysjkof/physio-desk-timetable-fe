import { createContext } from 'react';
import { DateRange, PatientAtMessage, PickedRangeType } from '.';
import { startAndLastOfDay } from '../../../../../utils/dateUtils';

export interface PickPatientInput {
  patient: PatientAtMessage;
  isNewMessage?: boolean;
}

export const MessagesContext = createContext<{
  dateRange: DateRange;
  patient: PatientAtMessage | undefined;
  isNewMessage: boolean;
  pickPatient: (input: PickPatientInput) => void;
  setDateRange: React.Dispatch<PickedRangeType>;
  toggleNewMessageAndResetPatient: () => void;
}>({
  dateRange: { value: startAndLastOfDay(new Date()), type: 'today' },
  patient: undefined,
  isNewMessage: true,
  pickPatient: () => {},
  setDateRange: () => {},
  toggleNewMessageAndResetPatient: () => {},
});
