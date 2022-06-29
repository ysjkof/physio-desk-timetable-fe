import { useReactiveVar } from "@apollo/client";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { EditReservationState } from "../../../components/molecules/edit-reservation-state";
import { ReservationState } from "../../../graphql/generated/graphql";
import { getHHMM } from "../../../libs/timetable-utils";
import { cls } from "../../../libs/utils";
import {
  IListReservation,
  selectedReservationVar,
  viewOptionsVar,
} from "../../../store";
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
  numberOfCell: number;
  startDate: Date;
  endDate: Date;
  registrationNumber: number;
  memo?: string | null;
  prescriptions?: any[];
  event: IListReservation;
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
  event,
}: EventBoxProps) {
  const isEdit = useMatch(RESERVE_DETAIL);
  const viewOptions = useReactiveVar(viewOptionsVar);
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);
  const height = numberOfCell * TABLE_CELL_HEIGHT;

  return (
    <motion.div
      whileHover={{ scale: 1.2, zIndex: 32 }}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
      className={cls("EVENT_BOX group absolute z-30 cursor-pointer")}
      style={{
        inset,
        height,
      }}
    >
      <div
        onClick={() =>
          isEdit ?? navigate(RESERVE_EDIT, { state: { reservationId } })
        }
        className={cls(
          "relative h-full overflow-hidden border px-1",
          !viewOptions.seeCancel &&
            reservationState === ReservationState.Canceled
            ? "hidden"
            : !viewOptions.seeNoshow &&
              reservationState === ReservationState.NoShow
            ? "hidden"
            : "",
          reservationState === ReservationState.NoShow
            ? "noshow "
            : reservationState === ReservationState.Canceled
            ? "cancel "
            : ""
        )}
        style={{
          ...(reservationState === ReservationState.Reserved && {
            borderColor: USER_COLORS[userIndex]?.deep,
            backgroundColor: USER_COLORS[userIndex]?.light,
          }),
        }}
      >
        <div className="h-5 overflow-hidden whitespace-nowrap text-center">
          <span className="ml-0.5 font-extralight">{registrationNumber}:</span>
          {patientName}
          {memo && (
            <div className="absolute right-0 top-0 h-[5px] w-[5px] bg-red-500" />
          )}
        </div>
        {prescriptions && numberOfCell !== 1 && (
          <div className="h-5 overflow-hidden text-ellipsis whitespace-nowrap text-center">
            {prescriptions.map((prescription) => prescription.name + " ")}
          </div>
        )}
        {
          numberOfCell > 2 ? (
            memo ? (
              <div
                className="overflow-hidden break-all font-extralight leading-5"
                style={{ height: (numberOfCell - 2) * TABLE_CELL_HEIGHT }}
              >
                {memo}
              </div>
            ) : null
          ) : null // 칸이 없어서 메모 생략
        }
      </div>
      {isHover && (
        <>
          <div className="absolute left-0 -top-[1rem] flex w-full items-baseline justify-between px-2 pb-1 text-gray-800">
            <FontAwesomeIcon
              icon={faCopy}
              fontSize={16}
              className="text-green-500 hover:scale-125"
              onClick={() => selectedReservationVar(event)}
            />
            <EditReservationState reservation={event} />
          </div>

          <div
            className={cls(
              "absolute top-4 left-[90px] w-[150px] rounded border p-1 shadow-cst",
              reservationState === ReservationState.NoShow
                ? "noshow "
                : reservationState === ReservationState.Canceled
                ? "cancel "
                : ""
            )}
            style={{
              ...(reservationState === ReservationState.Reserved && {
                borderColor: USER_COLORS[userIndex]?.deep,
                backgroundColor: USER_COLORS[userIndex]?.light,
              }),
            }}
          >
            <div className="mb-1 flex no-underline">
              예약시간 :{" "}
              {`${getHHMM(startDate, ":")} ~ ${getHHMM(endDate, ":")}`}
            </div>
            {event.memo && (
              <div className="flex flex-col pt-1 no-underline">
                메모 : {event.memo}
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
