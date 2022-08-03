import { Helmet } from 'react-helmet-async';
import { useReactiveVar } from '@apollo/client';
import {
  clinicListsVar,
  IListReservation,
  IMemberWithActivate,
  loggedInUserVar,
  selectedClinicVar,
  selectedDateVar,
  todayNowVar,
  viewOptionsVar,
} from '../../store';
import { useListReservations } from '../../hooks/useListReservations';
import { TimetableTemplate } from './table-template';
import { useEffect, useState } from 'react';
import {
  compareDateMatch,
  compareSameWeek,
  DayWithUsers,
  getSunday,
  getTimeGaps,
  getWeeks,
  makeDayWithUsers,
  spreadClinicMembers,
} from '../../libs/timetable-utils';
import { ONE_DAY, TABLE_TIME_GAP } from '../../variables';
import { TableHeader } from './organisms/table-header';
import { AnimatePresence } from 'framer-motion';
import { TableLabels } from './organisms/table-labels';
import { TableSubHeader } from './organisms/table-sub-header';
import { TableModals } from './organisms/table-modal';
import { Loading } from '../../components/atoms/loading';
import TableCols from './organisms/table-cols';
import {
  ListenDeleteReservationDocument,
  ListenDeleteReservationSubscription,
  ListenUpdateReservationDocument,
  ListenUpdateReservationSubscription,
} from '../../graphql/generated/graphql';
import { changeValueInArray, removeItemInArrayByIndex } from '../../libs/utils';

export interface TimetableModalProps {
  closeAction: () => void;
}

export const getActiveUserLength = (members?: IMemberWithActivate[]) =>
  members?.filter((user) => user.isActivate).length ?? 0;

export const TimeTable = () => {
  const today = useReactiveVar(todayNowVar);
  const viewOptions = useReactiveVar(viewOptionsVar);
  const clinicLists = useReactiveVar(clinicListsVar);
  const selectedClinic = useReactiveVar(selectedClinicVar);
  const selectedDate = useReactiveVar(selectedDateVar);
  const loggedInUser = useReactiveVar(loggedInUserVar);
  const [weekEvents, setWeekEvents] = useState<DayWithUsers[] | null>(null);
  const [prevSelectedDate, setPrevSelectedDate] = useState<Date>(today);

  const { data, subscribeToMore } = useListReservations();

  const optionalWeekEvents =
    viewOptions.periodToView === ONE_DAY
      ? weekEvents && [weekEvents[selectedDate.getDay()]]
      : weekEvents;

  const labels = getTimeGaps(
    viewOptions.tableDuration.start.hours,
    viewOptions.tableDuration.start.minutes,
    viewOptions.tableDuration.end.hours,
    viewOptions.tableDuration.end.minutes,
    TABLE_TIME_GAP
  );

  useEffect(() => {
    if (data && loggedInUser && selectedClinic) {
      function distributor(events: IListReservation[], clinicId: number) {
        if (!loggedInUser) return;

        const userFrame = makeDayWithUsers(
          spreadClinicMembers(clinicLists, clinicId),
          getWeeks(getSunday(selectedDate))
        );
        events?.forEach((event) => {
          const dateIndex = userFrame.findIndex((day) =>
            compareDateMatch(day.date, new Date(event.startDate), 'ymd')
          );
          if (dateIndex !== -1) {
            const userIndex = userFrame[dateIndex].users.findIndex(
              (member) => member.user.id === event.user.id
            );
            if (userIndex !== -1) {
              userFrame[dateIndex].users[userIndex].events.push(event);
            }
          }
        });
        return userFrame;
      }

      const { results } = data.listReservations;
      const distributeEvents = distributor(results!, selectedClinic.id);
      if (distributeEvents) {
        setWeekEvents(distributeEvents);
      } else {
        console.error(
          '❌ distributeEvents를 알 수 없습니다 : ',
          distributeEvents
        );
      }
    } else {
      console.warn(
        `✅ 시간표 > useEffect 실패; data is:${data?.listReservations}; loggedInUser:${loggedInUser?.id};`,
        'viewOptions : ',
        !!viewOptions,
        'optionalWeekEvents : ',
        !!optionalWeekEvents
      );
    }
    if (data?.listReservations.ok && selectedClinic?.id) {
      subscribeToMore({
        document: ListenDeleteReservationDocument,
        variables: { input: { clinicId: selectedClinic.id } },
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
        variables: { input: { clinicId: selectedClinic.id } },
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
  }, [data, clinicLists, selectedClinic]);

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
      {!viewOptions || !optionalWeekEvents ? (
        <Loading />
      ) : (
        <TimetableTemplate
          header={<TableHeader today={today} />}
          labels={<TableLabels labels={labels} />}
          body={
            <>
              <AnimatePresence>
                {viewOptions.seeList === false && (
                  <>
                    <TableSubHeader />
                    <TableCols
                      labels={labels}
                      weekEvents={optionalWeekEvents}
                    />
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
