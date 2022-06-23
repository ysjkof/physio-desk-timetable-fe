import { useReactiveVar } from "@apollo/client";
import { motion } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import { ReservationState } from "../../../graphql/generated/graphql";
import { getHHMM } from "../../../libs/timetable-utils";
import { viewOptionsVar } from "../../../store";
import {
  RESERVE_DETAIL,
  RESERVE_EDIT,
  TABLE_CELL_HEIGHT,
  USER_COLORS,
} from "../../../variables";
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
      whileHover={{ scale: 1.2, zIndex: 32 }}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      onClick={() =>
        isEdit ?? navigate(RESERVE_EDIT, { state: { reservationId } })
      }
      className={`group absolute z-30 grid cursor-pointer items-center justify-center border bg-white px-1 ${
        height === TABLE_CELL_HEIGHT + "px"
          ? "grid-cols-2"
          : `grid-rows-[${TABLE_CELL_HEIGHT + "px"},
              ${TABLE_CELL_HEIGHT + "px"},1fr]`
      } ${
        !viewOptions.seeCancel && reservationState === ReservationState.Canceled
          ? "hidden"
          : !viewOptions.seeNoshow &&
            reservationState === ReservationState.NoShow
          ? "hidden"
          : ""
      } ${
        reservationState === ReservationState.NoShow
          ? "noshow"
          : reservationState === ReservationState.Canceled
          ? "cancel"
          : ""
      }`}
      style={{
        inset,
        height,
        borderColor: USER_COLORS[0][userIndex],
      }}
    >
      <div className="h-5 overflow-hidden whitespace-nowrap text-center">
        {patientName}
        {registrationNumber && height !== TABLE_CELL_HEIGHT + "px" && (
          <span className="ml-1 opacity-50">{registrationNumber}</span>
        )}
      </div>
      {prescriptions && (
        <div className="h-5 overflow-hidden text-center">
          {prescriptions.map((prescription) => prescription.name)}
        </div>
      )}
      {memo &&
        (height !== TABLE_CELL_HEIGHT + "px" ||
          height !== TABLE_CELL_HEIGHT * 2 + "px") && (
          <div className="h-full overflow-hidden break-all pt-1">{memo}</div>
        )}
      <p className="bubble-arrow-t-center bubble-apear invisible absolute -bottom-16 right-1/2 w-32 translate-x-1/2 rounded-md bg-black py-4 text-center text-white opacity-0 group-hover:visible group-hover:opacity-100">
        {`${getHHMM(startDate, ":")} ~ ${getHHMM(endDate, ":")}`}
      </p>
    </motion.div>
  );
}
