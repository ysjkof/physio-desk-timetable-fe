import { type Reducer, useReducer, useState } from 'react';
import { endOfYesterday, startOfYesterday } from 'date-fns';
import { MessagesContext } from './MessagesContext';
import { MessageFilter } from './MessageFilter';
import { PatientNavigation } from './PatientNavigation';
import { MessageBox } from './MessageBox';
import {
  startAndLastOfDay,
  startAndLastOfThisWeek,
} from '../../../../../utils/dateUtils';
import { setAlert } from '../../../../../store';
import type { IdAndName, TwoDate } from '../../../../../types/commonTypes';
import type { PatientInSearch } from '../../../../../types/processedGeneratedTypes';

type DateRangeReducer = Reducer<DateRange, PickedRangeType>;
export interface DateRange {
  value: TwoDate;
  type: PickedRangeType;
}
export type PickedRangeType = 'thisWeek' | 'yesterday' | 'today' | 'all';
export interface PatientAtMessage extends IdAndName {
  to: PatientInSearch['phone'];
}

const defaultDateRange: DateRange = {
  value: startAndLastOfDay(new Date()),
  type: 'today',
};

const Messages = () => {
  const [dateRange, setDateRange] = useReducer<DateRangeReducer>(
    dateRangeReducer,
    defaultDateRange
  );

  const [patient, setPatient] = useState<PatientAtMessage>();
  const [isNewMessage, setIsNewMessage] = useState(false);

  const clearPatient = () => setPatient(undefined);
  const pickPatient = (patient: PatientAtMessage) => {
    const to = patient.to;
    if (!to) return setAlert({ messages: ['전화번호가 없습니다.'] });
    setIsNewMessage(false);
    setPatient(patient);
  };
  const toggleNewMessageAndResetPatient = () => {
    setIsNewMessage((prev) => !prev);
    setPatient(undefined);
  };

  return (
    <MessagesContext.Provider
      value={{
        dateRange,
        isNewMessage,
        patient,
        pickPatient,
        toggleNewMessageAndResetPatient,
      }}
    >
      <div className="flex h-full divide-x overflow-y-hidden overflow-x-scroll rounded-md border bg-white shadow">
        <MessageFilter
          dateRange={dateRange}
          setDateRange={setDateRange}
          clearPatient={clearPatient}
        />
        <PatientNavigation dates={dateRange} />
        <MessageBox />
      </div>
    </MessagesContext.Provider>
  );
};

export default Messages;
export { Messages };

const dateRangeReducer: Reducer<DateRange, PickedRangeType> = (state, type) => {
  switch (type) {
    case 'today':
      return { value: startAndLastOfDay(new Date()), type };
    case 'yesterday':
      return { value: [startOfYesterday(), endOfYesterday()], type };
    case 'thisWeek':
      return { value: startAndLastOfThisWeek(), type };
    case 'all':
      return { value: [new Date(0), new Date()], type };
    default:
      throw new Error('Unhandled action');
  }
};
