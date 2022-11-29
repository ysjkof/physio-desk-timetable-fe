import { lazy, useEffect, useRef, useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import {
  compareDateMatch,
  getSunday,
  getWeeks,
} from '../../services/dateServices';
import {
  distributeReservation,
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
import { TableDisplay } from '../../models';
import { useTimetable } from './hooks/useTimetable';
const Loading = lazy(() => import('../../_legacy_components/atoms/Loading'));

export interface TimetableModalProps {
  closeAction: () => void;
}

export default function TimeTable() {
  const { labels } = useTableLabel();
  const { weekEvents } = useTimetable();

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
                  <Schedules labels={labels} weekEvents={weekEvents} />
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
