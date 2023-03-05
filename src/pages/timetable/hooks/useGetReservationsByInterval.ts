import { QueryResult, useQuery } from '@apollo/client';
import { endOfDay, nextSaturday } from 'date-fns';
import { getSunday } from '../../../utils/dateUtils';
import { GET_RESERVATIONS_BY_INTERVAL_DOCUMENT } from '../../../graphql';
import { resetStoreAndLocalStorage, setToast, useStore } from '../../../store';
import { useNavigate } from 'react-router-dom';
import type {
  GetReservationsByIntervalQuery,
  GetReservationsByIntervalQueryVariables,
} from '../../../types/generatedTypes';
import type { ResultOfGetReservationsByInterval } from '../../../types/processedGeneratedTypes';

export const useGetReservationsByInterval = (): [
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

  const user = useStore((state) => state.user);
  const navigation = useNavigate();

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
      if (error === '당신은 병원의 멤버가 아닙니다') {
        resetStoreAndLocalStorage(user);
        navigation('/');
      }
    },
  });

  return [results.data?.getReservationsByInterval, results];
};
