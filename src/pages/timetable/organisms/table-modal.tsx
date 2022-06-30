import { useMatch, useNavigate } from "react-router-dom";
import { CreatePatientModal } from "../../../components/templates/create-patient-modal";
import { ReserveCardModal } from "./reserve-card-modal";
import { TIMETABLE } from "../../../variables";
import { ReservationModal } from "../../../components/templates/reservation-card-modal";

export function TableModals() {
  const navigate = useNavigate();

  const isReserve = useMatch("tt/reserve");
  const isEdit = useMatch("tt/edit");
  const isCreatePatient = useMatch("tt/create-patient");
  return (
    <>
      {isEdit && (
        <ReservationModal closeAction={() => isEdit && navigate(TIMETABLE)} />
      )}
      {isReserve && (
        <ReserveCardModal
          closeAction={() => isReserve && navigate(TIMETABLE)}
        />
      )}
      {isCreatePatient && (
        <CreatePatientModal
          closeAction={() => isCreatePatient && navigate(TIMETABLE)}
        />
      )}
    </>
  );
}
