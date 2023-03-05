import { QueryResult, useQuery } from '@apollo/client';
import { endOfDay, nextSaturday } from 'date-fns';
import { getSunday } from '../../../utils/dateUtils';
import { GET_RESERVATIONS_BY_INTERVAL_DOCUMENT } from '../../../graphql';
import { setToast, useStore } from '../../../store';
import type {
  GetReservationsByIntervalQuery,
  GetReservationsByIntervalQueryVariables,
} from '../../../types/generatedTypes';
import type { ResultOfGetReservationsByInterval } from '../../../types/processedGeneratedTypes';

export const useListReservations = (): [
  ResultOfGetReservationsByInterval,
  QueryResult<
    GetReservationsByIntervalQuery,
    GetReservationsByIntervalQueryVariables
  >
] => {
  const pickedDate = useStore((state) => state.pickedDate);
  const startDate = getSunday(pickedDate);
  const endDate = endOfDay(nextSaturday(startDate));
  const clinicId = useStore((state) => state.pickedClinicId);

  const variables = { input: { startDate, endDate, clinicId } };

  const results = useQuery<
    GetReservationsByIntervalQuery,
    GetReservationsByIntervalQueryVariables
  >(GET_RESERVATIONS_BY_INTERVAL_DOCUMENT, {
    variables,
    fetchPolicy: 'cache-and-network',
    onCompleted(data) {
      const { error } = data.getReservationsByInterval;
      if (error) {
        setToast({ messages: [error] });
      }
    },
  });

  return [results.data?.getReservationsByInterval, results];
};
