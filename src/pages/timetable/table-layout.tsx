import { useReactiveVar } from "@apollo/client";
import { ListReservationsQuery } from "../../graphql/generated/graphql";
import { ReservationCard } from "./reservation-card";
import { todayNowVar, viewOptionsVar } from "../../store";
import { ReserveCard } from "./reserve-card";
import { PrescriptionWithSelect } from ".";
import { AnimatePresence, motion } from "framer-motion";
import { TableHeader } from "./components/table-header";
import { useMatch, useNavigate } from "react-router-dom";
import { TIMETABLE } from "../../variables";
import { TableMain } from "./components/table-main";
import { TableClinicSelector } from "./components/table-clinic-selector";
import { TableNavExpand } from "./components/table-nav-expand";
import { TableNav } from "./components/table-nav";
import { CreatePatient } from "./create-patient";

export interface TimetableModalProps {
  closeAction: () => void;
  refetch: () => void;
}

interface ITimetableProps {
  eventsData: ListReservationsQuery;
  prescriptions: PrescriptionWithSelect[];
  refetch: () => void;
}

export const TimetableLayout = ({
  prescriptions,
  eventsData,
  refetch,
}: ITimetableProps) => {
  const isReserve = useMatch("tt/reserve");
  const isEdit = useMatch("tt/edit");
  const isCreatePatient = useMatch("tt/create-patient");
  const navigate = useNavigate();
  const today = useReactiveVar(todayNowVar);
  const viewOptions = useReactiveVar(viewOptionsVar);

  const tableNavVarients = {
    ini: (isUp: boolean) => ({ y: isUp ? -40 : 30 }),
    start: { y: 0, transition: { type: "tween", duration: 0.3 } },
  };

  if (!viewOptions) {
    return <></>;
  }
  return (
    <>
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
              prescriptions={prescriptions}
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
      {/* ------------------- 모달 구분선 -------------------*/}
      <motion.div
        animate={{ opacity: 1 }}
        className="timetable-layout-container opacity-0"
      >
        <TableHeader today={today} />
        <AnimatePresence>
          {viewOptions.navigationExpand ? (
            <TableNavExpand varients={tableNavVarients} />
          ) : (
            <TableNav varients={tableNavVarients} />
          )}
        </AnimatePresence>
        <div className="flex">
          <AnimatePresence>
            <TableMain eventsData={eventsData} />
            {viewOptions.seeActiveOption && <TableClinicSelector />}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};
