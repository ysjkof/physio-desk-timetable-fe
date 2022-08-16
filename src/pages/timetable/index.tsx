import { Helmet } from 'react-helmet-async';
import { useListReservations } from '../../hooks/useListReservations';
import { TableTemplate } from './templates/TableTemplate';
import { useEffect, useRef, useState } from 'react';
import {
  compareDateMatch,
  compareSameWeek,
  getSunday,
  getWeeks,
} from '../../services/dateServices';
import { TableNav } from './organisms/TableNav';
import { AnimatePresence } from 'framer-motion';
import TimeLabels from './organisms/TimeLabels';
import { Titles } from './organisms/Titles';
import { TableModals } from './molecules/TableModals';
import { Loading } from '../../components/atoms/Loading';
import Schedules from './organisms/Schedules';
import {
  ListenDeleteReservationDocument,
  ListenDeleteReservationSubscription,
  ListenUpdateReservationDocument,
  ListenUpdateReservationSubscription,
} from '../../graphql/generated/graphql';
import {
  changeValueInArray,
  removeItemInArrayByIndex,
} from '../../utils/utils';
import {
  distributeReservation,
  makeUsersInDay,
  spreadClinicMembers,
} from '../../services/timetableServices';
import { DayWithUsers, IMemberWithActivate } from '../../types/type';
import { useMe } from '../../hooks/useMe';
import useViewoptions from '../../hooks/useViewOption';
import useStore from '../../hooks/useStore';

export interface TimetableModalProps {
  closeAction: () => void;
}

export const getActiveUserLength = (members?: IMemberWithActivate[]) =>
  members?.filter((user) => user.isActivate).length || 0;

export const TimeTable = () => {
  const { labels } = useViewoptions();
  const { data: loggedInUser } = useMe();
  const { data: reservationData, subscribeToMore } = useListReservations();
  const { selectedInfo, viewOptions, clinicLists, selectedDate } = useStore();

  const [weekEvents, setWeekEvents] = useState<DayWithUsers[] | null>(null);
  const [prevSelectedDate, setPrevSelectedDate] = useState<Date>(
    () => new Date()
  );

  const [userFrameForWeek, setUserFrameForWeek] = useState<DayWithUsers[]>([]);
  let prevSelectedClinicId = useRef(0).current;

  useEffect(() => {
    if (
      reservationData?.listReservations.results &&
      loggedInUser &&
      selectedInfo.clinic
    ) {
      const selectedSunday = getSunday(selectedDate);
      const clinicId = selectedInfo.clinic.id;

      if (
        clinicId === prevSelectedClinicId &&
        userFrameForWeek[0] &&
        compareDateMatch(userFrameForWeek[0].date, selectedSunday, 'ymd')
      )
        return;

      prevSelectedClinicId = clinicId;

      const newUserFrameForWeek = makeUsersInDay(
        spreadClinicMembers(clinicLists, selectedInfo.clinic.id),
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

    if (reservationData?.listReservations.ok && selectedInfo.clinic?.id) {
      subscribeToMore({
        document: ListenDeleteReservationDocument,
        variables: { input: { clinicId: selectedInfo.clinic.id } },
        updateQuery: (
          prev,
          {
            subscriptionData: {
              data: { listenDeleteReservation },
            },
          }: { subscriptionData: { data: ListenDeleteReservationSubscription } }
        ) => {
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
        document: ListenUpdateReservationDocument,
        variables: { input: { clinicId: selectedInfo.clinic.id } },
        // 웹소켓이 받는 updated 데이터와 listReservation의 데이터 형태가 달라 타입에러 발생
        // 하지만 id로 apollo cache가 필요한 값을 처리한다
        // 타입에러 해결방법은,
        // 1. listReservation의 에러필드를 선택적필드로 바꿈
        // 2. 웹소켓이 listReservation처럼 모든 필드를 보냄
        // 웹소켓이 보내는 데이터량을 줄이기 위해 ts-ignore하고 문제시 바꾸기로함
        // @ts-ignore
        updateQuery: (
          prev,
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
  }, [reservationData, clinicLists, selectedInfo.clinic]);

  useEffect(() => {
    if (!compareDateMatch(selectedDate, prevSelectedDate, 'ym')) {
      console.log('✅ 년월이 다르다');
    } else if (
      !compareDateMatch(selectedDate, prevSelectedDate, 'd') &&
      !compareSameWeek(selectedDate, prevSelectedDate)
    ) {
      console.log('✅ 년월이 같고 일과 주가 다르다');
    }
    setPrevSelectedDate(selectedDate);
  }, [selectedDate]);

  return (
    <>
      <Helmet>
        <title>시간표 | Muool</title>
      </Helmet>
      {!viewOptions || !weekEvents ? (
        <Loading />
      ) : (
        <TableTemplate
          nav={<TableNav />}
          labels={<TimeLabels labels={labels} />}
          columns={
            <>
              <AnimatePresence>
                {viewOptions.seeList === false && (
                  <>
                    <Titles userFrameForWeek={userFrameForWeek} />
                    <Schedules labels={labels} weekEvents={weekEvents} />
                  </>
                )}
              </AnimatePresence>
              {viewOptions.seeList === true && '준비 중'}
            </>
          }
        />
      )}
      <TableModals />
    </>
  );
};
