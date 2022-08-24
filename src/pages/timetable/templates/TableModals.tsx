import { useMatch, useNavigate } from 'react-router-dom';
import { CreatePatientModal } from '../organisms/CreatePatientModal';
import { ReserveModal } from '../organisms/ReserveModal';
import { ReservationModal } from '../organisms/ReservationModal';
import { ROUTES } from '../../../router/routes';

export function TableModals() {
  const navigate = useNavigate();

  const isReserve = useMatch(ROUTES.reserve);
  const isEdit = useMatch(ROUTES.editReservation);
  const isCreatePatient = useMatch(ROUTES.createPatient);
  return (
    <>
      {isEdit ? (
        <ReservationModal
          closeAction={() => isEdit && navigate(ROUTES.timetable)}
        />
      ) : isReserve ? (
        <ReserveModal
          closeAction={() => isReserve && navigate(ROUTES.timetable)}
        />
      ) : (
        isCreatePatient && (
          <CreatePatientModal
            closeAction={() => isCreatePatient && navigate(ROUTES.timetable)}
          />
        )
      )}
    </>
  );
}
