import { useReactiveVar } from "@apollo/client";
import { useState } from "react";
import {
  Clinic,
  ListReservationsQuery,
  Patient,
  Prescription,
  Reservation,
  User,
} from "../../../graphql/generated/graphql";
import { getSunday, getWeeks } from "../../../libs/timetable-utils";
import { ReservationDetail } from "../reservation-detail";
import { selectedClinicVar, todayNowVar, viewOptionsVar } from "../../../store";
import { ModalPortal } from "../../../components/modal-portal";
import { Reserve } from "../reserve";
import { PrescriptionWithSelect } from "..";
import { AnimatePresence, motion } from "framer-motion";
import { TableHeader } from "./table-header";
import { useMatch, useNavigate } from "react-router-dom";
import { TIMETABLE } from "../../../variables";

interface ITimeOption {
  start: { hours: number; minutes: number };
  end: { hours: number; minutes: number };
}

interface ITimetableProps {
  tableTime: ITimeOption;
  eventsData?: ListReservationsQuery;
  prescriptions: PrescriptionWithSelect[];
  refetch: () => void;
  children: React.ReactNode;
}
export interface ModifiedReservation
  extends Pick<Reservation, "id" | "startDate" | "endDate" | "state" | "memo"> {
  user: Pick<User, "id" | "name">;
  lastModifier?: Pick<User, "id" | "name" | "email"> | null;
  patient: Pick<
    Patient,
    "id" | "name" | "gender" | "registrationNumber" | "birthday"
  >;
  clinic?: Pick<Clinic, "id" | "name"> | null;
  prescriptions?: Pick<Prescription, "name">[] | null;
}

export const TimetableLayout = ({
  prescriptions,
  children,
  refetch,
}: ITimetableProps) => {
  const isReserve = useMatch("tt/reserve");
  const isEdit = useMatch("tt/edit");
  const navigate = useNavigate();
  const today = useReactiveVar(todayNowVar);
  const [weeks, setWeeks] = useState<{ date: Date }[]>(
    getWeeks(getSunday(today))
  );
  const viewOptions = useReactiveVar(viewOptionsVar);
  const selectedClinic = useReactiveVar(selectedClinicVar);

  if (!viewOptions) {
    return <></>;
  }
  return (
    <>
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="timetable-container h-full text-xs"
      >
        <TableHeader today={today} weeks={weeks} />
        {children}
      </motion.div>
      <AnimatePresence>
        {isEdit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="fixed top-0 left-0 z-[100] h-screen w-screen bg-black/50 opacity-0"
          >
            <div
              className="modal-background absolute h-full w-full"
              onClick={() => isEdit && navigate(TIMETABLE)}
            />
            <ReservationDetail
              refetch={refetch}
              selectedClinic={selectedClinic}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {isReserve && (
        <ModalPortal
          closeAction={() => isReserve && navigate(TIMETABLE)}
          children={
            <Reserve
              prescriptions={prescriptions}
              refetch={refetch}
              closeAction={() => isReserve && navigate(TIMETABLE)}
            />
          }
        />
      )}
    </>
  );
};
