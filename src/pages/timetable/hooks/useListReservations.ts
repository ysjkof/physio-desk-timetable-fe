import { QueryResult, useQuery } from '@apollo/client';
import { endOfDay, nextSaturday } from 'date-fns';
import { getSunday } from '../../../utils/dateUtils';
import { LIST_RESERVATIONS_DOCUMENT } from '../../../graphql';
import { setToast, useStore } from '../../../store';
import type {
  ListReservationsQuery,
  ListReservationsQueryVariables,
} from '../../../types/generatedTypes';
import type { ResultOfListReservations } from '../../../types/processedGeneratedTypes';

export const useListReservations = (): [
  ResultOfListReservations,
  QueryResult<ListReservationsQuery, ListReservationsQueryVariables>
] => {
  const pickedDate = useStore((state) => state.pickedDate);
  const startDate = getSunday(pickedDate);
  const endDate = endOfDay(nextSaturday(startDate));
  const clinicId = useStore((state) => state.pickedClinicId);

  const variables = { input: { startDate, endDate, clinicId } };

  const results = useQuery<
    ListReservationsQuery,
    ListReservationsQueryVariables
  >(LIST_RESERVATIONS_DOCUMENT, {
    variables,
    fetchPolicy: 'cache-and-network',
    onCompleted(data) {
      const { error } = data.listReservations;
      if (error) {
        setToast({ messages: [error] });
      }
    },
  });

  return [results.data?.listReservations, results];
};
