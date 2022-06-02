import { AnimatePresence } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import { CreatePatient } from "../../../components/organisms/create-patient";
import { ReservationCard } from "../../../components/organisms/reservation-card";
import { ReserveCard } from "./reserve-card";
import { TIMETABLE } from "../../../variables";
import { ModalTemplate } from "../../../components/molecules/modal-template";

interface TableModalsProps {
  refetch: () => void;
}

export function TableModals({ refetch }: TableModalsProps) {
  const navigate = useNavigate();

  const isReserve = useMatch("tt/reserve");
  const isEdit = useMatch("tt/edit");
  const isCreatePatient = useMatch("tt/create-patient");
  return (
    <AnimatePresence>
      {isEdit && (
        <ModalTemplate
          onClick={() => isEdit && navigate(TIMETABLE)}
          children={
            <ReservationCard
              refetch={refetch}
              closeAction={() => isEdit && navigate(TIMETABLE)}
            />
          }
        />
      )}
      {isReserve && (
        <ModalTemplate
          onClick={() => isReserve && navigate(TIMETABLE)}
          children={
            <ReserveCard
              refetch={refetch}
              closeAction={() => isReserve && navigate(TIMETABLE)}
            />
          }
        />
      )}
      {isCreatePatient && (
        <ModalTemplate
          onClick={() => isCreatePatient && navigate(TIMETABLE)}
          children={
            <CreatePatient
              refetch={refetch}
              closeAction={() => isCreatePatient && navigate(TIMETABLE)}
            />
          }
        />
      )}
    </AnimatePresence>
  );
}
