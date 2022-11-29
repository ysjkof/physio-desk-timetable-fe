import { useQuery } from '@apollo/client';
import { useStore } from '../../../hooks';
import { getAfterDate, getSunday } from '../../../services/dateServices';
import { LIST_RESERVATIONS_DOCUMENT } from '../../../graphql';
import { ClinicsOfClient } from '../../../models';
import {
  changeValueInArray,
  removeItemInArrayByIndex,
} from '../../../utils/utils';
import type {
  ListenDeleteReservationSubscription,
  ListenUpdateReservationSubscription,
  ListReservationsQuery,
} from '../../../types/generated.types';

export const useListReservations = () => {
  const { selectedDate } = useStore();

  const { selectedClinic } = ClinicsOfClient;

  const startDate = getSunday(selectedDate);

  if (!selectedClinic) throw new Error('선택된 병원이 없습니다.');

  const updateQueryOfListenDelete = (
    prev: ListReservationsQuery,
    {
      subscriptionData: {
        data: { listenDeleteReservation },
      },
    }: { subscriptionData: { data: ListenDeleteReservationSubscription } }
  ) => {
    if (!listenDeleteReservation || !prev.listReservations.results) return prev;

    const idx = prev.listReservations.results.findIndex(
      (reservation) => reservation.id === listenDeleteReservation.id
    );
    if (idx === -1) return prev;

    return {
      ...prev,
      listReservations: {
        ...prev.listReservations,
        results: removeItemInArrayByIndex(idx, prev.listReservations.results),
      },
    };
  };

  const updateQueryOfListenUpdate = (
    prev: ListReservationsQuery,
    {
      subscriptionData: {
        data: { listenUpdateReservation },
      },
    }: { subscriptionData: { data: ListenUpdateReservationSubscription } }
  ) => {
    if (!listenUpdateReservation || !prev.listReservations.results) return prev;

    let newReservation = null;
    let results = [...prev.listReservations.results, listenUpdateReservation];

    const reservationIdx = prev.listReservations.results.findIndex(
      (reservation) => reservation.id === listenUpdateReservation.id
    );

    if (reservationIdx !== -1) {
      newReservation = {
        ...prev.listReservations.results![reservationIdx],
        ...listenUpdateReservation,
      };
      results = changeValueInArray(
        prev.listReservations.results!,
        newReservation,
        reservationIdx
      );
    }

    return {
      ...prev,
      listReservations: {
        ...prev.listReservations,
        results,
      },
    };
  };

  return {
    ...useQuery<ListReservationsQuery>(LIST_RESERVATIONS_DOCUMENT, {
      variables: {
        input: {
          startDate,
          endDate: getAfterDate(startDate, 7), // sunday가 1일이면 endDate는 8일 0시 00분이다. 그래서 1일~7일까지 쿼리된다.
          userIds: selectedClinic.members.map((m) => m.user.id),
          clinicId: selectedClinic.id,
        },
      },
      fetchPolicy: 'cache-and-network',
    }),
    updateQueryOfListenDelete,
    updateQueryOfListenUpdate,
  };
};
