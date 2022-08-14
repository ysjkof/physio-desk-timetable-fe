import { useListReservationsQuery } from '../graphql/generated/graphql';
import { getAfterDate, getSunday } from '../services/dateServices';
import useStore from './useStore';

export const useListReservations = () => {
  const { selectedInfo, clinicLists } = useStore();

  const startDate = getSunday(selectedInfo.date);
  const selectedClinic = clinicLists.find(
    (clinic) => clinic.id === selectedInfo.clinic?.id
  );
  const userIds = selectedClinic?.members.map((m) => m.user.id) || [0];
  const clinicId = selectedClinic?.id || 0;

  return useListReservationsQuery({
    variables: {
      input: {
        startDate,
        endDate: getAfterDate(startDate, 7), // sunday가 1일이면 endDate는 8일 0시 00분이다. 그래서 1일~7일까지 쿼리된다.
        userIds,
        clinicId,
      },
    },
  });
};
