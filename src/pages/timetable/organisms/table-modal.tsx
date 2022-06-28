import { useMatch, useNavigate } from "react-router-dom";
import { CreatePatientModal } from "../../../components/templates/create-patient-modal";
import { ReserveCardModal } from "./reserve-card-modal";
import { TIMETABLE } from "../../../variables";
import { ReservationModal } from "../../../components/templates/reservation-card-modal";

interface TableModalsProps {
  refetch: () => void;
}

export function TableModals({ refetch }: TableModalsProps) {
  const navigate = useNavigate();

  const isReserve = useMatch("tt/reserve");
  const isEdit = useMatch("tt/edit");
  const isCreatePatient = useMatch("tt/create-patient");
  return (
    <>
      {isEdit && (
        <ReservationModal
          refetch={refetch}
          closeAction={() => isEdit && navigate(TIMETABLE)}
        />
      )}
      {isReserve && (
        <ReserveCardModal
          refetch={refetch}
          closeAction={() => isReserve && navigate(TIMETABLE)}
        />
      )}
      {isCreatePatient && (
        <CreatePatientModal
          refetch={refetch}
          closeAction={() => isCreatePatient && navigate(TIMETABLE)}
        />
      )}
    </>
  );
}
