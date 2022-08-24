import { useMatch, useNavigate } from 'react-router-dom';
import { CreatePatientModal } from '../organisms/CreatePatientModal';
import { ReserveModal } from '../organisms/ReserveModal';
import { ReservationModal } from '../organisms/ReservationModal';
import { ROUTER } from '../../../router/routerConstants';

export function TableModals() {
  const navigate = useNavigate();

  const isReserve = useMatch(ROUTER.reserve);
  const isEdit = useMatch(ROUTER.editReservation);
  const isCreatePatient = useMatch(ROUTER.createPatient);
  return (
    <>
      {isEdit ? (
        <ReservationModal
          closeAction={() => isEdit && navigate(ROUTER.timetable)}
        />
      ) : isReserve ? (
        <ReserveModal
          closeAction={() => isReserve && navigate(ROUTER.timetable)}
        />
      ) : (
        isCreatePatient && (
          <CreatePatientModal
            closeAction={() => isCreatePatient && navigate(ROUTER.timetable)}
          />
        )
      )}
    </>
  );
}
