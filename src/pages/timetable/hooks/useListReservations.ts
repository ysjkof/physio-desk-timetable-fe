import { useQuery, useReactiveVar } from '@apollo/client';
import { endOfDay, nextSaturday } from 'date-fns';
import { getSunday } from '../../../utils/date.utils';
import { LIST_RESERVATIONS_DOCUMENT } from '../../../graphql';
import { selectedDateVar, useStore } from '../../../store';
import type { ListReservationsQuery } from '../../../types/generated.types';

export const useListReservations = () => {
  const selectedDate = useReactiveVar(selectedDateVar);
  const startDate = getSunday(selectedDate);
  const endDate = endOfDay(nextSaturday(startDate));
  const clinicId = useStore((state) => state.selectedClinicId);

  return {
    ...useQuery<ListReservationsQuery>(LIST_RESERVATIONS_DOCUMENT, {
      variables: {
        input: {
          startDate,
          endDate,
          clinicId,
        },
      },
      fetchPolicy: 'cache-and-network',
    }),
  };
};
