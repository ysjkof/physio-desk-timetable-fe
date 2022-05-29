import { useReactiveVar } from "@apollo/client";
import { ListReservationsQuery } from "../../../graphql/generated/graphql";
import { ReservationCard } from "../reservation-card";
import { todayNowVar, viewOptionsVar } from "../../../store";
import { ModalPortal } from "../../../components/modal-portal";
import { ReserveCard } from "../reserve-card";
import { PrescriptionWithSelect } from "..";
import { AnimatePresence, motion } from "framer-motion";
import { TableHeader } from "./table-header";
import { useMatch, useNavigate } from "react-router-dom";
import { TIMETABLE } from "../../../variables";
import { TimetableMain } from "./table-main";
import { TableClinicSelector } from "./table-clinic-selector";
import { useEffect, useState } from "react";

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
  const navigate = useNavigate();
  const today = useReactiveVar(todayNowVar);
  const viewOptions = useReactiveVar(viewOptionsVar);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | false = false;
    function handleTableHeight() {
      const headerElement = document.getElementById("header");
      const tableHeaderElement = document.getElementById("table-header");
      const height =
        window.innerHeight -
        headerElement?.offsetHeight! -
        tableHeaderElement?.offsetHeight! -
        40;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setHeight(height);
      }, 200);
    }
    handleTableHeight();
    window.addEventListener("resize", handleTableHeight);
    return () => window.removeEventListener("resize", handleTableHeight);
  }, []);
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
            className="fixed top-0 left-0 z-40 h-screen w-screen bg-black/50"
          >
            <div
              className="modal-background absolute h-full w-full"
              onClick={() => isEdit && navigate(TIMETABLE)}
            />
            <ReservationCard refetch={refetch} />
          </motion.div>
        )}
      </AnimatePresence>
      {isReserve && (
        <ModalPortal
          closeAction={() => isReserve && navigate(TIMETABLE)}
          children={
            <ReserveCard
              prescriptions={prescriptions}
              refetch={refetch}
              closeAction={() => isReserve && navigate(TIMETABLE)}
            />
          }
        />
      )}
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{
          delay: 0.2,
          duration: 0.4,
        }}
        className="timetable-layout-container text-xs"
      >
        <TableHeader today={today} />
        <div
          className="table-main-container flex h-full"
          style={{ height: height ? height : "80vh" }}
        >
          <TimetableMain eventsData={eventsData} />
          <AnimatePresence>
            {viewOptions.seeActiveOption && <TableClinicSelector />}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};
