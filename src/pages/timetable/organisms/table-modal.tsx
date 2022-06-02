import { AnimatePresence, motion } from "framer-motion";
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
    <AnimatePresence>
      {isEdit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="modal-parents"
        >
          <div
            className="modal-background"
            onClick={() => isEdit && navigate(TIMETABLE)}
          />
          <ReservationCard
            refetch={refetch}
            closeAction={() => isEdit && navigate(TIMETABLE)}
          />
        </motion.div>
      )}
      {isReserve && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="modal-parents"
        >
          <div
            className="modal-background"
            onClick={() => isReserve && navigate(TIMETABLE)}
          />
          <ReserveCard
            refetch={refetch}
            closeAction={() => isReserve && navigate(TIMETABLE)}
          />
        </motion.div>
      )}
      {isCreatePatient && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="modal-parents"
        >
          <div
            className="modal-background"
            onClick={() => isCreatePatient && navigate(TIMETABLE)}
          />
          <CreatePatient
            refetch={refetch}
            closeAction={() => isCreatePatient && navigate(TIMETABLE)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
