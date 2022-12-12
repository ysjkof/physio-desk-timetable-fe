import { lazy, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSchedules, useSubscriptions, useTableLabel } from './hooks';
import { MUOOL } from '../../constants/constants';
import {
  ReserveOrDayoff,
  Schedules,
  TableAside,
  TableController,
  TimeLabels,
  TimetableTemplate,
} from './components';
import { TableDisplay } from '../../models';

const Loading = lazy(() => import('../../_legacy_components/atoms/Loading'));

const TimeTable = () => {
  const { labels } = useTableLabel();
  const { schedules, variables } = useSchedules();
  useSubscriptions({ variables });

  const navigate = useNavigate();
  const location = useLocation();
  const closeAction = () => navigate('', { state: null });

  console.log('TimeTable > location > ', location);

  useEffect(() => {
    return () => closeAction();
  }, []);

  return (
    <>
      <Helmet>
        <title>시간표 | {MUOOL}</title>
      </Helmet>
      {!TableDisplay.get() || !schedules ? (
        <Loading />
      ) : (
        <TimetableTemplate
          aside={<TableAside />}
          nav={<TableController />}
          labels={<TimeLabels labels={labels} />}
          columns={
            <>
              <AnimatePresence>
                {TableDisplay.get().seeList === false && (
                  <Schedules labels={labels} weekEvents={schedules} />
                )}
              </AnimatePresence>
              {TableDisplay.get().seeList === true && '준비 중'}
            </>
          }
        />
      )}
      {location.state && <ReserveOrDayoff closeAction={closeAction} />}
    </>
  );
};

export default TimeTable;
