import { useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import {
  LISTEN_DELETE_RESERVATION_DOCUMENT,
  LISTEN_UPDATE_RESERVATION_DOCUMENT,
  GET_RESERVATIONS_BY_INTERVAL_DOCUMENT,
} from '../../../graphql';
import { changeValueInArray } from '../../../utils/commonUtils';
import { LISTEN_CREATE_RESERVATION_DOCUMENT } from '../../../graphql/subscriptions/listenCreateReservationGql';
import { useStore } from '../../../store';
import { client } from '../../../apollo';
import type {
  ListenCreateReservationSubscription,
  ListenDeleteReservationSubscription,
  ListenUpdateReservationSubscription,
  GetReservationsByIntervalQuery,
  GetReservationsByIntervalQueryVariables,
  QueryGetReservationsByIntervalArgs,
} from '../../../types/generatedTypes';
import type { ReservationOfGetReservationsByInterval } from '../../../types/processedGeneratedTypes';

interface UseSubscriptionsProps {
  variables: QueryGetReservationsByIntervalArgs | undefined;
}

// variables는 listReservation의 변수다.
export const useSubscriptions = ({ variables }: UseSubscriptionsProps) => {
  const clinicId = useStore((state) => state.pickedClinicId);

  const subscriptionVariables = { input: { clinicId } };

  const { loading: loadingOfDelete, data: deleteResult } =
    useSubscription<ListenDeleteReservationSubscription>(
      LISTEN_DELETE_RESERVATION_DOCUMENT,
      { variables: subscriptionVariables }
    );

  const { loading: loadingOfUpdate, data: updateResult } =
    useSubscription<ListenUpdateReservationSubscription>(
      LISTEN_UPDATE_RESERVATION_DOCUMENT,
      { variables: subscriptionVariables }
    );

  const { loading: loadingOfCreate, data: resultOfCreate } =
    useSubscription<ListenCreateReservationSubscription>(
      LISTEN_CREATE_RESERVATION_DOCUMENT,
      { variables: subscriptionVariables }
    );

  const cacheUpdateOptions = {
    query: GET_RESERVATIONS_BY_INTERVAL_DOCUMENT,
    variables,
  };

  const updateAfterDelete = (reservationId: number) => {
    client?.cache.updateQuery<
      GetReservationsByIntervalQuery,
      GetReservationsByIntervalQueryVariables
    >(cacheUpdateOptions, (cacheData) => {
      const cacheResults = cacheData?.getReservationsByInterval;
      if (!cacheResults) return;

      const reservations = cacheResults.results?.filter(
        (result) => result.id !== reservationId
      );
      const totalCount = Math.max(cacheResults.totalCount || 0 - 1, 0);

      const newData = structuredClone(cacheData);
      newData.getReservationsByInterval.results = reservations;
      newData.getReservationsByInterval.totalCount = totalCount;

      return newData;
    });
  };

  const updateAfterUpdate = (
    reservation: ListenUpdateReservationSubscription['listenUpdateReservation']
  ) => {
    client?.cache.updateQuery<
      GetReservationsByIntervalQuery,
      GetReservationsByIntervalQueryVariables
    >(cacheUpdateOptions, (cacheData) => {
      const cacheResults = cacheData?.getReservationsByInterval.results;
      if (!cacheResults) return;

      const updatedIndex = cacheResults.findIndex(
        (oldReservation) => oldReservation.id === reservation.id
      );
      if (updatedIndex === -1) return cacheData;

      const newData = structuredClone(cacheData);
      newData.getReservationsByInterval.results = changeValueInArray(
        cacheResults,
        reservation as ReservationOfGetReservationsByInterval, // 하위 필드에 id값만 받아서 경고 나타나지만 정상작동하므로 타입단언함.
        updatedIndex
      );

      return newData;
    });
  };

  const updateAfterCreate = (
    reservation: ReservationOfGetReservationsByInterval
  ) => {
    client?.cache.updateQuery<
      GetReservationsByIntervalQuery,
      GetReservationsByIntervalQueryVariables
    >(cacheUpdateOptions, (cacheData) => {
      if (!cacheData) return;
      const newData = structuredClone(cacheData);
      newData.getReservationsByInterval.results?.push(reservation);
      return newData;
    });
  };

  useEffect(() => {
    if (!loadingOfDelete && deleteResult && variables) {
      updateAfterDelete(deleteResult.listenDeleteReservation.id);
    }
  }, [loadingOfDelete, deleteResult]);

  useEffect(() => {
    if (!loadingOfUpdate && updateResult && variables) {
      updateAfterUpdate(updateResult.listenUpdateReservation);
    }
  }, [loadingOfUpdate, updateResult]);

  useEffect(() => {
    if (!loadingOfCreate && resultOfCreate && variables) {
      updateAfterCreate(resultOfCreate.listenCreateReservation);
    }
  }, [loadingOfCreate, resultOfCreate]);
};
