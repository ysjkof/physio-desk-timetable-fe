import { useMatch, useNavigate } from 'react-router-dom';
import { CreatePatientModal } from '../../../components/templates/CreatePatientModal';
import { ReserveCardModal } from './ReserveCardModal';
import { ReservationModal } from '../../../components/templates/ReservationCardModal';
import { ROUTER } from '../../../router/routerConstants';

export function TableModals() {
  const navigate = useNavigate();

  const isReserve = useMatch(ROUTER.RESERVE);
  const isEdit = useMatch(ROUTER.EDIT_RESERVE);
  const isCreatePatient = useMatch(ROUTER.CREATE_PATIENT);
  return (
    <>
      {isEdit && (
        <ReservationModal
          closeAction={() => isEdit && navigate(ROUTER.TIMETABLE)}
        />
      )}
      {isReserve && (
        <ReserveCardModal
          closeAction={() => isReserve && navigate(ROUTER.TIMETABLE)}
        />
      )}
      {isCreatePatient && (
        <CreatePatientModal
          closeAction={() => isCreatePatient && navigate(ROUTER.TIMETABLE)}
        />
      )}
    </>
  );
}
