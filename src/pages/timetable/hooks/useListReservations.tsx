import { useListReservationsQuery } from '../../../graphql/generated/graphql';
import { getAfterDate, getSunday } from '../../../services/dateServices';
import useStore from '../../../hooks/useStore';

export const useListReservations = () => {
  const { selectedInfo, selectedDate, clinicLists } = useStore();

  const startDate = getSunday(selectedDate);
  const selectedClinic = clinicLists.find(
    (clinic) => clinic.id === selectedInfo.clinic?.id
  );

  if (!selectedClinic) throw new Error('선택된 병원이 없습니다.');

  return useListReservationsQuery({
    variables: {
      input: {
        startDate,
        endDate: getAfterDate(startDate, 7), // sunday가 1일이면 endDate는 8일 0시 00분이다. 그래서 1일~7일까지 쿼리된다.
        userIds: selectedClinic.members.map((m) => m.user.id),
        clinicId: selectedClinic.id,
      },
    },
    fetchPolicy: 'cache-and-network',
  });
};
