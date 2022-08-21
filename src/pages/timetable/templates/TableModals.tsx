import { useMatch, useNavigate } from 'react-router-dom';
import { CreatePatientModal } from '../organisms/CreatePatientModal';
import { ReserveModal } from '../organisms/ReserveModal';
import { ReservationModal } from '../organisms/ReservationModal';
import { ROUTER } from '../../../router/routerConstants';

export function TableModals() {
  const navigate = useNavigate();

  const isReserve = useMatch(ROUTER.RESERVE);
  const isEdit = useMatch(ROUTER.EDIT_RESERVE);
  const isCreatePatient = useMatch(ROUTER.CREATE_PATIENT);
  return (
    <>
      {isEdit ? (
        <ReservationModal
          closeAction={() => isEdit && navigate(ROUTER.TIMETABLE)}
        />
      ) : isReserve ? (
        <ReserveModal
          closeAction={() => isReserve && navigate(ROUTER.TIMETABLE)}
        />
      ) : (
        isCreatePatient && (
          <CreatePatientModal
            closeAction={() => isCreatePatient && navigate(ROUTER.TIMETABLE)}
          />
        )
      )}
    </>
  );
}
