import { ReservationState } from "../../../graphql/generated/graphql";
import { cls } from "../../../libs/utils";
import { IViewOption } from "../../../store";

interface EventLiProps {
  viewOptions: IViewOption;
  reservationState: ReservationState;
  startDate: string;
  patientName: string;
  userName: string;
  onClick: () => void;
}
export function EventLi({
  viewOptions,
  reservationState,
  startDate,
  patientName,
  userName,
  onClick,
}: EventLiProps) {
  return (
    <div
      onClick={() => onClick()}
      className={cls(
        "cursor-pointer space-x-4 rounded-md border border-sky-300 bg-sky-100",
        !viewOptions.seeCancel && reservationState === ReservationState.Canceled
          ? "hidden"
          : !viewOptions.seeNoshow &&
            reservationState === ReservationState.NoShow
          ? "hidden"
          : reservationState === ReservationState.NoShow ||
            reservationState === ReservationState.Canceled
          ? "opacity-70"
          : "",
        reservationState === ReservationState.NoShow
          ? "noshow"
          : reservationState === ReservationState.Canceled
          ? "cancel"
          : ""
      )}
    >
      <span>{startDate}</span>
      <span>{patientName}</span>
      <span>{userName}</span>
    </div>
  );
}
