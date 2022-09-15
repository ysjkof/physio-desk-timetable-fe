import { TimetableModalProps } from '../..';
import { useLocation } from 'react-router-dom';
import {
  createDateFromDay,
  newDateSetHourAndMinute,
} from '../../../../services/dateServices';
import { useReactiveVar } from '@apollo/client';
import { selectedDateVar } from '../../../../store';
import ModalContentsLayout from '../../../../components/templates/ModalContentsLayout';
import SearchPatient from '../molecules/SearchPatient';
import ReserveForm from '../molecules/ReserveForm';
import ModalTemplate from '../../../../components/templates/ModalTemplate';

export default function ReserveModal({ closeAction }: TimetableModalProps) {
  const location = useLocation();
  const selectedDate = useReactiveVar(selectedDateVar);

  const state = location.state as {
    startDate: {
      hour: number;
      minute: number;
      dayIndex: number;
    };
    userId: number;
    isDayOff?: boolean;
  };

  const startDate =
    state.startDate &&
    newDateSetHourAndMinute({
      hour: state.startDate.hour,
      minute: state.startDate.minute,
      fromDate: createDateFromDay(selectedDate, state.startDate.dayIndex),
    });

  const { userId, isDayOff } = state;

  return (
    <ModalTemplate
      closeAction={closeAction}
      children={
        <ModalContentsLayout
          title={isDayOff ? '예약잠금' : '예약하기'}
          closeAction={closeAction}
          children={
            <>
              {!isDayOff && <SearchPatient />}
              <ReserveForm
                closeAction={closeAction}
                startDate={startDate}
                userId={userId}
                isDayoff={isDayOff}
              />
            </>
          }
        />
      }
    />
  );
}
