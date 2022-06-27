import { AnimatePresence } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import { CreatePatient } from "../../../components/organisms/create-patient";
import { ReservationCard } from "../../../components/organisms/reservation-card";
import { ReserveCard } from "./reserve-card";
import { TIMETABLE } from "../../../variables";

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
        <ReservationCard
          refetch={refetch}
          closeAction={() => isEdit && navigate(TIMETABLE)}
        />
      )}
      {isReserve && (
        <ReserveCard
          refetch={refetch}
          closeAction={() => isReserve && navigate(TIMETABLE)}
        />
      )}
      {isCreatePatient && (
        <CreatePatient
          refetch={refetch}
          closeAction={() => isCreatePatient && navigate(TIMETABLE)}
        />
      )}
    </>
  );
}
