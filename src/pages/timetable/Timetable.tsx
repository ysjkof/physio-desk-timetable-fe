import { lazy, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useSchedules, useSubscriptions, useTableLabel } from './hooks';
import { MUOOL } from '../../constants/constants';
import {
  CreatePatient,
  ReserveOrDayoff,
  Schedules,
  TableAside,
  TableController,
  TimeLabels,
  TimetableTemplate,
} from './components';
import { TableDisplay } from '../../models';
import { LocationState } from '../../types/common.types';
import { useCloseModal } from '../../hooks';

const Loading = lazy(() => import('../../_legacy_components/atoms/Loading'));

const TimeTable = () => {
  const { labels } = useTableLabel();
  const { schedules, variables } = useSchedules();
  useSubscriptions({ variables });

  const closeModal = useCloseModal();

  const locationState = useLocation().state as LocationState;

  useEffect(() => {
    return () => closeModal();
  }, []);

  if (!TableDisplay.get() || !schedules) return <Loading />;
  return (
    <>
      <Helmet>
        <title>시간표 | {MUOOL}</title>
      </Helmet>
      <TimetableTemplate
        aside={<TableAside />}
        nav={<TableController />}
        labels={<TimeLabels labels={labels} />}
        columns={
          <>
            {TableDisplay.get().seeList === false && (
              <AnimatePresence>
                <Schedules labels={labels} weekEvents={schedules} />
              </AnimatePresence>
            )}
            {TableDisplay.get().seeList === true && '준비 중'}
          </>
        }
      />
      {locationState?.createReservation && <ReserveOrDayoff />}
      {locationState?.createPatient && <CreatePatient />}
    </>
  );
};

export default TimeTable;
