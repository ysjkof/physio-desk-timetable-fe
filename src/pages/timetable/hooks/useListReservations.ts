import { QueryResult, useQuery, useReactiveVar } from '@apollo/client';
import { endOfDay, nextSaturday } from 'date-fns';
import { getSunday } from '../../../utils/date.utils';
import { LIST_RESERVATIONS_DOCUMENT } from '../../../graphql';
import { selectedDateVar, setToast, useStore } from '../../../store';
import type {
  ListReservationsQuery,
  ListReservationsQueryVariables,
} from '../../../types/generated.types';
import type { ResultOfListReservations } from '../../../types/common.types';

export const useListReservations = (): [
  ResultOfListReservations,
  QueryResult<ListReservationsQuery, ListReservationsQueryVariables>
] => {
  const selectedDate = useReactiveVar(selectedDateVar);
  const startDate = getSunday(selectedDate);
  const endDate = endOfDay(nextSaturday(startDate));
  const clinicId = useStore((state) => state.selectedClinicId);

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
