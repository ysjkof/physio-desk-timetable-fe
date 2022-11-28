import { lazy, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import {
  compareDateMatch,
  getSunday,
  getWeeks,
} from '../../services/dateServices';
import {
  changeValueInArray,
  removeItemInArrayByIndex,
} from '../../utils/utils';
import {
  distributeReservation,
  getActiveUserLength,
  makeUsersInDay,
  spreadClinicMembers,
} from '../timetableServices';
import { useMe } from '../../hooks/useMe';
import useStore from '../../hooks/useStore';
import { useListReservations, useTableLabel } from './hooks';
import { MUOOL } from '../../constants/constants';
import {
  Schedules,
  TableAside,
  TableController,
  TimeLabels,
  TimetableTemplate,
} from './components';
import TableModals from './_legacy_components/templates/TableModals';
import { ClinicsOfClient, TableDisplay } from '../../models';
import {
  LISTEN_DELETE_RESERVATION_DOCUMENT,
  LISTEN_UPDATE_RESERVATION_DOCUMENT,
} from '../../graphql';
import type { DayWithUsers } from '../../types/common.types';
import type {
  ListenDeleteReservationSubscription,
  ListenUpdateReservationSubscription,
  ListReservationsQuery,
} from '../../types/generated.types';
import { useReactiveVar } from '@apollo/client';
import { clinicListsVar } from '../../store';
const Loading = lazy(() => import('../../_legacy_components/atoms/Loading'));

export interface TimetableModalProps {
  closeAction: () => void;
}

export default function TimeTable() {
  const { labels } = useTableLabel();
  const { data: loginUser } = useMe();
  const { data: reservationData, subscribeToMore } = useListReservations();
  const { selectedDate } = useStore();

  const clinicList = useReactiveVar(clinicListsVar);

  const userLength = getActiveUserLength(
    ClinicsOfClient.selectedClinic?.members
  );

  const [weekEvents, setWeekEvents] = useState<DayWithUsers[] | null>(null);

  const [userFrameForWeek, setUserFrameForWeek] = useState<DayWithUsers[]>([]);

  let prevSelectedClinicId = useRef(0).current;

  useEffect(() => {
    const clinicId = ClinicsOfClient.selectedClinic!.id;

    if (reservationData?.listReservations.results && loginUser) {
      const selectedSunday = getSunday(selectedDate);

      if (
        clinicId === prevSelectedClinicId &&
        userFrameForWeek[0] &&
        compareDateMatch(userFrameForWeek[0].date, selectedSunday, 'ymd')
      )
        return;

      prevSelectedClinicId = clinicId;

      const newUserFrameForWeek = makeUsersInDay(
        spreadClinicMembers(ClinicsOfClient.value, clinicId),
        getWeeks(selectedSunday)
      );
      setUserFrameForWeek(newUserFrameForWeek);
      setWeekEvents(
        distributeReservation({
          events: reservationData.listReservations.results,
          dataForm: newUserFrameForWeek,
        })
      );
    }

    if (reservationData?.listReservations.ok && clinicId) {
      subscribeToMore({
        document: LISTEN_DELETE_RESERVATION_DOCUMENT,
        variables: { input: { clinicId } },
        updateQuery(
          prev: ListReservationsQuery,
          {
            subscriptionData: {
              data: { listenDeleteReservation },
            },
          }: { subscriptionData: { data: ListenDeleteReservationSubscription } }
        ) {
          if (!listenDeleteReservation || !prev.listReservations.results)
            return prev;

          const idx = prev.listReservations.results.findIndex(
            (reservation) => reservation.id === listenDeleteReservation.id
          );
          if (idx === -1) return prev;

          return {
            ...prev,
            listReservations: {
              ...prev.listReservations,
              results: removeItemInArrayByIndex(
                idx,
                prev.listReservations.results
              ),
            },
          };
        },
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
        updateQuery: (
          prev: ListReservationsQuery,
          {
            subscriptionData: {
              data: { listenUpdateReservation },
            },
          }: { subscriptionData: { data: ListenUpdateReservationSubscription } }
        ) => {
          if (!listenUpdateReservation || !prev.listReservations.results)
            return prev;

          let newReservation = null;
          let results = [
            ...prev.listReservations.results,
            listenUpdateReservation,
          ];

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
        },
      });
    }
  }, [reservationData, clinicList]);

  return (
    <>
      <Helmet>
        <title>시간표 | {MUOOL}</title>
      </Helmet>
      {!TableDisplay.value || !weekEvents ? (
        <Loading />
      ) : (
        <TimetableTemplate
          aside={<TableAside />}
          nav={<TableController />}
          labels={<TimeLabels labels={labels} />}
          columns={
            <>
              <AnimatePresence>
                {TableDisplay.value.seeList === false && (
                  <Schedules
                    userLength={userLength}
                    labels={labels}
                    weekEvents={weekEvents}
                  />
                )}
              </AnimatePresence>
              {TableDisplay.value.seeList === true && '준비 중'}
            </>
          }
        />
      )}
      <TableModals />
    </>
  );
}
