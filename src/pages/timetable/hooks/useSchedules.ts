import { useEffect, useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import {
  LISTEN_DELETE_RESERVATION_DOCUMENT,
  LISTEN_UPDATE_RESERVATION_DOCUMENT,
} from '../../../graphql';
import { ClinicsOfClient, Schedules } from '../../../models';
import { useListReservations } from './useListReservations';
import { useMe } from '../../../hooks';
import { clinicListsVar, selectedDateVar } from '../../../store';
import type { ISchedules } from '../../../types/common.types';

export const useSchedules = () => {
  const clinicList = useReactiveVar(clinicListsVar);
  const selectedDate = useReactiveVar(selectedDateVar);
  const [schedules, setSchedules] = useState<ISchedules[] | null>(null);

  const {
    data: reservationData,
    subscribeToMore,
    updateQueryOfListenDelete,
    updateQueryOfListenUpdate,
  } = useListReservations();

  const { data: loginUser } = useMe();

  useEffect(() => {
    const clinicId = ClinicsOfClient.selectedClinic.id;

    if (!reservationData?.listReservations.results || !loginUser) return;

    setSchedules(
      new Schedules(reservationData.listReservations.results, selectedDate)
        .value
    );

    subscribeToMore({
      document: LISTEN_DELETE_RESERVATION_DOCUMENT,
      variables: { input: { clinicId } },
      updateQuery: updateQueryOfListenDelete,
    });

    subscribeToMore({
      document: LISTEN_UPDATE_RESERVATION_DOCUMENT,
      variables: { input: { clinicId } },
      // 웹소켓이 받는 updated 데이터와 listReservation의 데이터 형태가 달라 타입에러 발생
      // 하지만 id로 apollo cache가 필요한 값을 처리한다
      // 타입에러 해결방법은,
      // 1. listReservation의 에러필드를 선택적필드로 바꿈
      // 2. 웹소켓이 listReservation처럼 모든 필드를 보냄
      // 웹소켓이 보내는 데이터량을 줄이기 위해 ts-ignore하고 문제시 바꾸기로함
      // @ts-ignore
      updateQuery: updateQueryOfListenUpdate,
    });
  }, [reservationData, clinicList]);

  return { schedules };
};
