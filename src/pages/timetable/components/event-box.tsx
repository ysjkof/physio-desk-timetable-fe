import { useReactiveVar } from "@apollo/client";
import { motion } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import { ReservationState } from "../../../graphql/generated/graphql";
import { getHHMM } from "../../../libs/timetable-utils";
import { cls } from "../../../libs/utils";
import { viewOptionsVar } from "../../../store";
import { RESERVE_DETAIL, RESERVE_EDIT } from "../../../variables";
interface EventBoxProps {
  reservationId: number;
  userIndex: number;
  reservationState: ReservationState;
  patientName: string;
  inset: string;
  height: string;
  startDate: Date;
  endDate: Date;
  registrationNumber?: string | null;
  memo?: string | null;
  prescriptions?: any[];
}
export function EventBox({
  reservationId,
  userIndex,
  reservationState,
  patientName,
  inset,
  height,
  startDate,
  endDate,
  registrationNumber,
  memo,
  prescriptions,
}: EventBoxProps) {
  const isEdit = useMatch(RESERVE_DETAIL);
  const viewOptions = useReactiveVar(viewOptionsVar);
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.2, zIndex: 31 }}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      onClick={() =>
        isEdit ?? navigate(RESERVE_EDIT, { state: { reservationId } })
      }
      className={cls(
        "group absolute z-30 mx-0.5 cursor-pointer border-gray-500 px-1 ring-1",
        height === "20px"
          ? "grid grid-cols-2"
          : "grid grid-rows-[20px,20px,1fr]",
        userIndex === 0
          ? "user-color-1"
          : userIndex === 1
          ? "user-color-2"
          : userIndex === 2
          ? "user-color-3"
          : userIndex === 3
          ? "user-color-4"
          : userIndex === 4
          ? "user-color-5"
          : "",
        !viewOptions.seeCancel && reservationState === ReservationState.Canceled
          ? "hidden"
          : !viewOptions.seeNoshow &&
            reservationState === ReservationState.NoShow
          ? "hidden"
          : "",
        reservationState === ReservationState.NoShow
          ? "noshow-color"
          : reservationState === ReservationState.Canceled
          ? "cancel-color"
          : ""
      )}
      style={{
        inset,
        height,
      }}
    >
      <div className="h-5 overflow-hidden whitespace-nowrap text-base">
        {patientName}
        {registrationNumber && height !== "20px" && (
          <span className="ml-1 text-sm text-gray-500">
            {registrationNumber}
          </span>
        )}
      </div>
      {prescriptions && (
        <div className="h-5 overflow-hidden text-base">
          {prescriptions.map((prescription) => prescription.name)}
        </div>
      )}
      {memo && height !== "20px" && height !== "40px" && (
        <div className="h-full overflow-hidden break-all border-gray-600 pt-1">
          {memo}
        </div>
      )}
      <p className="bubble-arrow-t-center bubble-apear invisible absolute -bottom-16 right-1/2 w-32 translate-x-1/2 rounded-md bg-black py-4 text-center text-white opacity-0 group-hover:visible group-hover:opacity-100">
        {`${getHHMM(startDate, ":")} ~ ${getHHMM(endDate, ":")}`}
      </p>
    </motion.div>
  );
}
