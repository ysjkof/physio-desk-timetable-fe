import { useReactiveVar } from '@apollo/client';
import {
  ClinicType,
  useListReservationsQuery,
} from '../graphql/generated/graphql';
import { getAfterDate, getSunday } from '../services/dateServices';
import { clinicListsVar } from '../store';
import { useMe } from './useMe';
import useStore from './useStore';

export const useListReservations = () => {
  const { data } = useMe();
  const { selectedInfo } = useStore();
  const clinicLists = useReactiveVar(clinicListsVar);
  const sunday = getSunday(selectedInfo.date);

  return useListReservationsQuery({
    variables: {
      input: {
        startDate: sunday,
        endDate: getAfterDate(sunday, 7), // sunday가 1일이면 endDate는 8일 0시 00분이다. 그래서 1일~7일까지 쿼리된다.
        userIds: clinicLists
          .find((g) => g.id === selectedInfo.clinic?.id)
          ?.members.map((m) => m.user.id) ?? [0],
        clinicId:
          selectedInfo.clinic?.id ||
          data?.me.members!.find(
            (member) => member.clinic.type === ClinicType.Personal
          )?.clinic.id ||
          0,
      },
    },
  });
};
