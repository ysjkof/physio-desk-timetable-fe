import { lazy, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSchedules, useSubscriptions, useTableLabel } from './hooks';
import { MUOOL } from '../../constants/constants';
import {
  CreatePatient,
  ReserveOrDayoff,
  Schedules,
  TableController,
  TimeLabels,
  TimetableTemplate,
} from './components';
import type { LocationState } from '../../types/commonTypes';

const Loading = lazy(() => import('../../components/Loading'));

const TimeTable = () => {
  const { labels } = useTableLabel();
  const { schedules, variables } = useSchedules();
  useSubscriptions({ variables });

  const locationState = useLocation().state as LocationState;

  const navigate = useNavigate();
  const clearLocationState = () => {
    navigate('', { state: null });
  };

  useEffect(() => {
    clearLocationState();
  }, []);

  if (!schedules) return <Loading />;
  return (
    <>
      <Helmet>
        <title>시간표 | {MUOOL}</title>
      </Helmet>
      <TimetableTemplate
        nav={<TableController />}
        labels={<TimeLabels labels={labels} />}
        columns={
          <AnimatePresence>
            <Schedules labels={labels} weekEvents={schedules} />
          </AnimatePresence>
        }
      />
      {locationState?.createReservation && <ReserveOrDayoff />}
      {locationState?.createPatient && <CreatePatient />}
    </>
  );
};

export default TimeTable;
