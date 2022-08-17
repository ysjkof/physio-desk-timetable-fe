import { SearchPatient } from '../../../components/organisms/SearchPatient';
import { TimetableModalProps } from '..';
import { ModalContentsLayout } from '../../../components/templates/ModalContentsLayout';
import { ReserveForm } from './ReserveForm';
import { ModalTemplate } from '../../../components/molecules/ModalTemplate';
import { useLocation } from 'react-router-dom';
import {
  createDateFromDay,
  newDateSetHourAndMinute,
} from '../../../services/dateServices';
import { useReactiveVar } from '@apollo/client';
import { selectedDateVar } from '../../../store';

export const ReserveCardModal = ({ closeAction }: TimetableModalProps) => {
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

  const startDate = newDateSetHourAndMinute({
    hour: state.startDate.hour,
    minute: state.startDate.minute,
    fromDate: createDateFromDay(selectedDate, state.startDate.dayIndex),
  });

  const userId = state.userId;
  const isDayOff = state.isDayOff;

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
};
