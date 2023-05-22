import { useEffect } from 'react';
import { DateRange } from '..';
import { useLazyGetMessagesEachPatient } from '../../../../../../hooks';

interface usePatientNavigationProps {
  dates: DateRange;
}
export const usePatientNavigation = ({ dates }: usePatientNavigationProps) => {
  const { patients, hasMorePage, fetchMore, getMessagesEachPatient } =
    useLazyGetMessagesEachPatient();

  useEffect(() => {
    getMessagesEachPatient(dates.value);
  }, [dates]);

  return { patients, hasMorePage, fetchMore };
};
