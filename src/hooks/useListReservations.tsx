import { useReactiveVar } from '@apollo/client';
import { useListReservationsQuery } from '../graphql/generated/graphql';
import { getAfterDate, getSunday } from '../services/dateServices';
import { clinicListsVar, selectedClinicVar, selectedDateVar } from '../store';

export const useListReservations = () => {
  const selectedClinic = useReactiveVar(selectedClinicVar);
  const selectedDate = useReactiveVar(selectedDateVar);
  const clinicLists = useReactiveVar(clinicListsVar);
  const sunday = getSunday(selectedDate);

  return useListReservationsQuery({
    variables: {
      input: {
        startDate: sunday,
        endDate: getAfterDate(sunday, 7), // sunday가 1일이면 endDate는 8일 0시 00분이다. 그래서 1일~7일까지 쿼리된다.
        userIds: clinicLists
          .find((g) => g.id === selectedClinic?.id)
          ?.members.map((m) => m.user.id) ?? [0],
        clinicId: selectedClinic?.id ?? 0,
      },
    },
  });
};
