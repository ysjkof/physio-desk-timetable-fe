import { lazy, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTimetable, useSubscriptions } from './hooks';
import { MUOOL } from '../../constants/constants';
import {
  CreatePatient,
  EventList,
  ReserveOrDayoff,
  Schedules,
  TableController,
  TimetableTemplate,
} from './components';
import { setToast, useStore } from '../../store';
import { useMe } from '../../hooks';
import type { LocationState } from '../../types/commonTypes';

const Loading = lazy(() => import('../../components/Loading'));

const TimeTable = () => {
  const pickedDate = useStore((state) => state.pickedDate);
  const locationState = useLocation().state as LocationState;
  const navigate = useNavigate();

  const { schedules, members, variables } = useTimetable();

  useSubscriptions({ variables });

  const [meData] = useMe();

  if (schedules && meData && !meData.verified) {
    setToast({
      messages: ['이메일 인증을 하면 모든 기능을 사용할 수 있습니다.'],
    });
  }

  useEffect(() => {
    const clearLocationState = () => {
      navigate('', { state: null });
    };

    clearLocationState();
  }, []);

  if (!schedules) return <Loading />;

  return (
    <>
      <Helmet title={`시간표 | ${MUOOL}`} />
      <TimetableTemplate
        nav={<TableController members={members} />}
        columns={
          <AnimatePresence>
            <Schedules weekEvents={schedules} />
          </AnimatePresence>
        }
        eventList={<EventList events={[schedules[pickedDate.getDay()]][0]} />}
      />
      {locationState?.createReservation && <ReserveOrDayoff />}
      {locationState?.createPatient && <CreatePatient />}
    </>
  );
};

export default TimeTable;
