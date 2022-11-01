import { TimetableModalProps } from '../../Timetable';
import { useLocation } from 'react-router-dom';
import {
  createDate,
  createDateFromDay,
} from '../../../../services/dateServices';
import { useReactiveVar } from '@apollo/client';
import { selectedDateVar } from '../../../../store';
import ModalContentsLayout from '../../../../_legacy_components/templates/ModalContentsLayout';
import SearchPatient from '../molecules/SearchPatient';
import ModalTemplate from '../../../../_legacy_components/templates/ModalTemplate';
import DayOffForm from '../molecules/DayOffForm';
import ReserveForm from '../molecules/ReserveForm';

interface LocationState {
  startDate: {
    hour: number;
    minute: number;
    dayIndex: number;
  };
  userId: number;
  isDayOff?: boolean;
}

export default function ReserveModal({ closeAction }: TimetableModalProps) {
  const location = useLocation();
  const selectedDate = useReactiveVar(selectedDateVar);

  const {
    startDate: { hour, minute, dayIndex },
    userId,
    isDayOff,
  }: LocationState = location.state;

  const startDate = createDate(createDateFromDay(selectedDate, dayIndex), {
    hour,
    minute,
  });

  return (
    <ModalTemplate
      closeAction={closeAction}
      children={
        <ModalContentsLayout
          title={isDayOff ? '예약잠금' : '예약하기'}
          closeAction={closeAction}
          children={
            <>
              {isDayOff ? (
                <DayOffForm
                  userId={userId}
                  startDate={startDate}
                  closeAction={closeAction}
                />
              ) : (
                <>
                  <SearchPatient />
                  <ReserveForm
                    userId={userId}
                    startDate={startDate}
                    closeAction={closeAction}
                  />
                </>
              )}
            </>
          }
        />
      }
    />
  );
}
