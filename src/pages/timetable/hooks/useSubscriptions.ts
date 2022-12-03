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
  ListenDeleteReservationSubscription,
  ListenUpdateReservationSubscription,
  ListReservationsQuery as Query,
  ListReservationsQueryVariables as Variables,
} from '../../../types/generated.types';
import { changeValueInArray } from '../../../utils/common.utils';

interface UseSubscriptionsProps {
  variables: OperationVariables | undefined;
}

export const useSubscriptions = ({ variables }: UseSubscriptionsProps) => {
  const clinicId = ClinicsOfClient.selectedClinic.id;

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
        // TODO: 리턴 타입 에러 해결(listen으로 받는 예약의 형태가 다른 문제)
        if (!cacheData) return;
        const { listReservations } = cacheData;

        const updatedIndex = listReservations.results.findIndex(
          (oldReservation) => oldReservation.id === reservation.id
        );
        if (updatedIndex === -1) return;

        const results = changeValueInArray(
          listReservations.results,
          reservation,
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
};
