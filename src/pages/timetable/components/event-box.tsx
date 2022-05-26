import { useReactiveVar } from "@apollo/client";
import { ReservationState } from "../../../graphql/generated/graphql";
import { getHHMM } from "../../../libs/timetable-utils";
import { cls } from "../../../libs/utils";
import { viewOptionsVar } from "../../../store";

interface EventBoxProps {
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
  onClick: () => void;
}
export function EventBox({
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
  onClick,
}: EventBoxProps) {
  const viewOptions = useReactiveVar(viewOptionsVar);

  return (
    <div
      onClick={onClick}
      className={cls(
        "group absolute z-40 mx-0.5 cursor-pointer border-gray-500 px-1 py-0.5 ring-2",
        height === "20px" ? "grid grid-cols-2" : "flex flex-col",
        userIndex === 0
          ? "user-color-1"
          : userIndex === 1
          ? "user-color-2"
          : userIndex === 2
          ? "user-color-3"
          : userIndex === 3
          ? "user-color-4"
          : "",
        !viewOptions?.seeCancel &&
          reservationState === ReservationState.Canceled
          ? "hidden"
          : !viewOptions?.seeNoshow &&
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
      <div className="h-5 overflow-hidden whitespace-nowrap">
        {patientName}
        {registrationNumber && height !== "20px" && (
          <span className="ml-1 text-gray-500">{registrationNumber}</span>
        )}
      </div>

      {prescriptions && (
        <div className="h-5 overflow-hidden">
          {prescriptions.map((prescription) => prescription.name)}
        </div>
      )}
      {memo && height !== "20px" && (
        <div className="mt-1 h-full overflow-hidden break-all border-t border-gray-600 pt-1">
          {memo}
        </div>
      )}
      <p className="bubble-arrow-t-center bubble-apear invisible absolute -bottom-16 right-1/2 z-50 w-32 translate-x-1/2 rounded-md bg-black py-4 text-center text-white opacity-0 group-hover:visible group-hover:opacity-100">
        {`${getHHMM(startDate, ":")} ~ ${getHHMM(endDate, ":")}`}
      </p>
    </div>
  );
}
