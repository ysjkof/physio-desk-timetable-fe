import { useQuery, useReactiveVar } from '@apollo/client';
import { endOfDay, nextSaturday } from 'date-fns';
import { getSunday } from '../../../utils/date.utils';
import { LIST_RESERVATIONS_DOCUMENT } from '../../../graphql';
import { ClinicsOfClient } from '../../../models';
import { selectedDateVar } from '../../../store';
import type { ListReservationsQuery } from '../../../types/generated.types';

export const useListReservations = () => {
  const selectedDate = useReactiveVar(selectedDateVar);

  const { selectedClinic } = ClinicsOfClient;

  const startDate = getSunday(selectedDate);
  const endDate = endOfDay(nextSaturday(startDate));

  if (!selectedClinic) throw new Error('선택된 병원이 없습니다.');

  return {
    ...useQuery<ListReservationsQuery>(LIST_RESERVATIONS_DOCUMENT, {
      variables: {
        input: {
          startDate,
          endDate,
          userIds: selectedClinic.members.map((m) => m.user.id),
          clinicId: selectedClinic.id,
        },
      },
      fetchPolicy: 'cache-and-network',
    }),
  };
};
