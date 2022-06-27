import { useReactiveVar } from "@apollo/client";
import { faBan, faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import { ReservationState } from "../../../graphql/generated/graphql";
import { getHHMM } from "../../../libs/timetable-utils";
import { cls } from "../../../libs/utils";
import { viewOptionsVar } from "../../../store";
import {
  RESERVE_DETAIL,
  RESERVE_EDIT,
  TABLE_CELL_HEIGHT,
  TABLE_CELL_HEIGHT_IN_ONE_MINUTE,
  USER_COLORS,
} from "../../../variables";
interface EventBoxProps {
  reservationId: number;
  userIndex: number;
  reservationState: ReservationState;
  patientName: string;
  inset: string;
  numberOfCell: number;
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
  numberOfCell,
  startDate,
  endDate,
  registrationNumber,
  memo,
  prescriptions,
}: EventBoxProps) {
  const isEdit = useMatch(RESERVE_DETAIL);
  const viewOptions = useReactiveVar(viewOptionsVar);
  const navigate = useNavigate();

  const height = numberOfCell * TABLE_CELL_HEIGHT;

  return (
    <motion.div
      whileHover={{ scale: 1.2, zIndex: 32 }}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      onClick={() =>
        isEdit ?? navigate(RESERVE_EDIT, { state: { reservationId } })
      }
      className={cls(
        "group absolute z-30 cursor-pointer items-center justify-center border bg-white px-1",
        !viewOptions.seeCancel && reservationState === ReservationState.Canceled
          ? "hidden"
          : !viewOptions.seeNoshow &&
            reservationState === ReservationState.NoShow
          ? "hidden"
          : "",
        reservationState === ReservationState.NoShow
          ? "noshow"
          : reservationState === ReservationState.Canceled
          ? "cancel"
          : ""
      )}
      style={{
        inset,
        height,
        ...(reservationState === ReservationState.Reserved && {
          borderColor: USER_COLORS[userIndex]?.deep,
          backgroundColor: USER_COLORS[userIndex]?.light,
        }),
      }}
    >
      <div className="h-5 overflow-hidden whitespace-nowrap text-center">
        {reservationState === ReservationState.NoShow && (
          <FontAwesomeIcon icon={faCommentSlash} fontSize={14} />
        )}
        {reservationState === ReservationState.Canceled && (
          <FontAwesomeIcon icon={faBan} fontSize={14} />
        )}
        {patientName}
        {registrationNumber && (
          <span className="ml-0.5 font-extralight">:{registrationNumber}</span>
        )}
      </div>
      {prescriptions && numberOfCell !== 1 && (
        <div className="h-5 overflow-hidden text-center">
          {prescriptions.map((prescription) => prescription.name)}
        </div>
      )}
      {
        numberOfCell > 2 ? (
          memo ? (
            <div className="h-full overflow-hidden break-all font-extralight">
              {memo}
              메모가 없습니다
            </div>
          ) : null
        ) : null // 칸이 없어서 메모 생략
      }
      <p className="bubble-arrow-t-center bubble-apear invisible absolute -bottom-16 right-1/2 w-32 translate-x-1/2 rounded-md bg-black py-4 text-center text-white opacity-0 group-hover:visible group-hover:opacity-100">
        {`${getHHMM(startDate, ":")} ~ ${getHHMM(endDate, ":")}`}
      </p>
    </motion.div>
  );
}
