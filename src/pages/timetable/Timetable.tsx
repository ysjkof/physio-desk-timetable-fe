import { lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { useSchedules, useTableLabel } from './hooks';
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

const Loading = lazy(() => import('../../_legacy_components/atoms/Loading'));

export interface TimetableModalProps {
  closeAction: () => void;
}

const TimeTable = () => {
  const { labels } = useTableLabel();
  const { schedules } = useSchedules();

  return (
    <>
      <Helmet>
        <title>시간표 | {MUOOL}</title>
      </Helmet>
      {!TableDisplay.value || !schedules ? (
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
                  <Schedules labels={labels} weekEvents={schedules} />
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
};

export default TimeTable;
