import { useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import {
  LISTEN_DELETE_RESERVATION_DOCUMENT,
  LISTEN_UPDATE_RESERVATION_DOCUMENT,
  LIST_RESERVATIONS_DOCUMENT,
} from '../../../graphql';
import { changeValueInArray } from '../../../utils/commonUtils';
import { LISTEN_CREATE_RESERVATION_DOCUMENT } from '../../../graphql/subscriptions/listenCreateReservationGql';
import { useStore } from '../../../store';
import type {
  QueryListReservationsArgs,
  ListenCreateReservationSubscription,
  ListenDeleteReservationSubscription,
  ListenUpdateReservationSubscription,
  ListReservationsQuery as Query,
  ListReservationsQueryVariables as Variables,
} from '../../../types/generatedTypes';
import type { ReservationInList } from '../../../types/processedGeneratedTypes';

interface UseSubscriptionsProps {
  variables: QueryListReservationsArgs | undefined;
}

// variables는 listReservation의 변수다.
export const useSubscriptions = ({ variables }: UseSubscriptionsProps) => {
  const clinicId = useStore((state) => state.pickedClinicId);
  const client = useStore((state) => state.client);

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

  const cacheUpdateOptions = { query: LIST_RESERVATIONS_DOCUMENT, variables };

  const updateAfterDelete = (reservationId: number) => {
    client?.cache.updateQuery<Query, Variables>(
      cacheUpdateOptions,
      (cacheData) => {
        const cacheResults = cacheData?.listReservations;
        if (!cacheResults) return;

        const reservations = cacheResults.results?.filter(
          (result) => result.id !== reservationId
        );
        const totalCount = Math.max(cacheResults.totalCount || 0 - 1, 0);

        const newData = structuredClone(cacheData);
        newData.listReservations.results = reservations;
        newData.listReservations.totalCount = totalCount;

        return newData;
      }
    );
  };

  const updateAfterUpdate = (
    reservation: ListenUpdateReservationSubscription['listenUpdateReservation']
  ) => {
    client?.cache.updateQuery<Query, Variables>(
      cacheUpdateOptions,
      (cacheData) => {
        const cacheResults = cacheData?.listReservations.results;
        if (!cacheResults) return;

        const updatedIndex = cacheResults.findIndex(
          (oldReservation) => oldReservation.id === reservation.id
        );
        if (updatedIndex === -1) return cacheData;

        const newData = structuredClone(cacheData);
        newData.listReservations.results = changeValueInArray(
          cacheResults,
          reservation as ReservationInList, // 하위 필드에 id값만 받아서 경고 나타나지만 정상작동하므로 타입단언함.
          updatedIndex
        );

        return newData;
      }
    );
  };

  const updateAfterCreate = (reservation: ReservationInList) => {
    client?.cache.updateQuery<Query, Variables>(
      cacheUpdateOptions,
      (cacheData) => {
        if (!cacheData) return;
        const newData = structuredClone(cacheData);
        newData.listReservations.results?.push(reservation);
        return newData;
      }
    );
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
