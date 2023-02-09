import { useEffect } from 'react';
import { OperationVariables, useSubscription } from '@apollo/client';
import { client } from '../../../apollo';
import {
  LISTEN_DELETE_RESERVATION_DOCUMENT,
  LISTEN_UPDATE_RESERVATION_DOCUMENT,
  LIST_RESERVATIONS_DOCUMENT,
} from '../../../graphql';
import { ClinicsOfClient } from '../../../models';
import type {
  ListenCreateReservationSubscription,
  ListenDeleteReservationSubscription,
  ListenUpdateReservationSubscription,
  ListReservationsQuery as Query,
  ListReservationsQueryVariables as Variables,
} from '../../../types/generated.types';
import { changeValueInArray } from '../../../utils/common.utils';
import { LISTEN_CREATE_RESERVATION_DOCUMENT } from '../../../graphql/subscriptions/listenCreateReservation.gql';
import { ReservationInList } from '../../../types/common.types';

interface UseSubscriptionsProps {
  variables: OperationVariables | undefined;
}

export const useSubscriptions = ({ variables }: UseSubscriptionsProps) => {
  const clinicId = ClinicsOfClient.getSelectedClinic().id;

  const { loading: loadingOfDelete, data: deleteResult } =
    useSubscription<ListenDeleteReservationSubscription>(
      LISTEN_DELETE_RESERVATION_DOCUMENT,
      { variables: { input: { clinicId } } }
    );

  const { loading: loadingOfUpdate, data: updateResult } =
    useSubscription<ListenUpdateReservationSubscription>(
      LISTEN_UPDATE_RESERVATION_DOCUMENT,
      { variables: { input: { clinicId } } }
    );

  const { loading: loadingOfCreate, data: resultOfCreate } =
    useSubscription<ListenCreateReservationSubscription>(
      LISTEN_CREATE_RESERVATION_DOCUMENT,
      { variables: { input: { clinicId } } }
    );

  const updateAfterDelete = (reservationId: number) => {
    client.cache.updateQuery<Query, Variables>(
      {
        query: LIST_RESERVATIONS_DOCUMENT,
        variables: variables as Variables,
      },
      (cacheData) => {
        if (!cacheData) return;
        const { listReservations } = cacheData;

        const results = listReservations.results.filter(
          (result) => result.id !== reservationId
        );
        const totalCount = listReservations.totalCount - 1;

        return {
          ...cacheData,
          listReservations: {
            ...listReservations,
            results,
            totalCount,
          },
        };
      }
    );
  };

  const updateAfterUpdate = (
    reservation: ListenUpdateReservationSubscription['listenUpdateReservation']
  ) => {
    client.cache.updateQuery<Query, Variables>(
      {
        query: LIST_RESERVATIONS_DOCUMENT,
        variables: variables as Variables,
      },
      (cacheData) => {
        if (!cacheData) return;
        const { listReservations } = cacheData;

        const updatedIndex = listReservations.results.findIndex(
          (oldReservation) => oldReservation.id === reservation.id
        );
        if (updatedIndex === -1) return;

        const results = changeValueInArray(
          listReservations.results,
          reservation as ReservationInList, // 하위 필드에 id값만 받아서 경고 나타나지만 정상작동하므로 타입단언함.
          updatedIndex
        );

        return {
          ...cacheData,
          listReservations: {
            ...cacheData.listReservations,
            results,
          },
        };
      }
    );
  };

  const updateAfterCreate = (reservation: ReservationInList) => {
    client.cache.updateQuery<Query, Variables>(
      {
        query: LIST_RESERVATIONS_DOCUMENT,
        variables: variables as Variables,
      },
      (cacheData) => {
        if (!cacheData) return;
        return {
          ...cacheData,
          listReservations: {
            ...cacheData.listReservations,
            results: [...cacheData.listReservations.results, reservation],
          },
        };
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
