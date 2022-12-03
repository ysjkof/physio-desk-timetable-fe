import { lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { useSchedules, useSubscriptions, useTableLabel } from './hooks';
import { MUOOL } from '../../constants/constants';
import {
  Schedules,
  TableAside,
  TableController,
  TimeLabels,
  TimetableTemplate,
} from './components';
import { TableDisplay } from '../../models';
import TableModals from './_legacy_components/templates/TableModals';

const Loading = lazy(() => import('../../_legacy_components/atoms/Loading'));

const TimeTable = () => {
  const { labels } = useTableLabel();
  const { schedules, variables } = useSchedules();
  useSubscriptions({ variables });

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
      <TableModals />
    </>
  );
};

export default TimeTable;
