import { useReactiveVar } from "@apollo/client";
import { ReservationState } from "../../../graphql/generated/graphql";
import { cls } from "../../../libs/utils";
import { IViewOption, viewOptionsVar } from "../../../store";

interface EventBoxProps {
  userIndex: number;
  reservationState: ReservationState;
  patientName: string;
  inset: string;
  height: string;
  prescriptions?: any[];
  onClick: () => void;
}
export function EventBox({
  userIndex,
  reservationState,
  patientName,
  prescriptions,
  inset,
  height,
  onClick,
}: EventBoxProps) {
  const viewOptions = useReactiveVar(viewOptionsVar);

  return (
    <div
      onClick={onClick}
      className={cls(
        "absolute z-40 mx-1.5 cursor-pointer rounded-md ring-2",
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
      <div>{patientName}</div>
      {prescriptions && (
        <div>{prescriptions.map((prescription) => prescription.name)}</div>
      )}
    </div>
  );
}
