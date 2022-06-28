import { getHHMM, getTimeLength, getYMD } from "../../libs/timetable-utils";
import { RESERVATION_STATE_KOR } from "../../variables";
import { IListReservation } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faRegistered } from "@fortawesome/free-regular-svg-icons";
import { faBan, faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import { cls } from "../../libs/utils";
import { ReservationState } from "../../graphql/generated/graphql";

interface ReservationCardDetailProps {
  reservation: IListReservation;
  changeToEdit: () => void;
  changeToReserve: () => void;
  changeToNoshow: () => void;
  changeToCancel: () => void;
}

export const ReservationCardDetail = ({
  reservation,
  changeToEdit,
  changeToReserve,
  changeToNoshow,
  changeToCancel,
}: ReservationCardDetailProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="relative grid grid-cols-[5rem,1fr] items-center">
        <span className="">담당 치료사</span>
        <span>{reservation.user.name}</span>
        <FontAwesomeIcon
          icon={faEdit}
          fontSize={14}
          className="absolute right-0 cursor-pointer hover:scale-150"
          onClick={() => changeToEdit()}
        />
      </div>

      <div className="grid grid-cols-[5rem,1fr] items-center">
        <span className="">예약시간</span>
        <span>{getYMD(reservation.startDate, "yyyymmdd", "-")}</span>
        <span className="col-start-2">
          {getHHMM(reservation.startDate, ":")} ~{" "}
          {getHHMM(reservation.endDate, ":")} (
          {getTimeLength(reservation.startDate, reservation.endDate, "minute")}
          분)
        </span>
      </div>

      <div className="grid grid-cols-[5rem,1fr] items-center">
        <span className="">처방</span>
        <span className="space-x-4">
          {reservation.prescriptions?.map((prescription, i) => (
            <span key={i}>{prescription.name}</span>
          ))}
        </span>
      </div>

      <div className="grid grid-cols-[5rem,1fr] items-center">
        <span className="">상태</span>
        <span className="flex justify-between">
          {RESERVATION_STATE_KOR[reservation.state]}
          <div className="space-x-4">
            <FontAwesomeIcon
              icon={faRegistered}
              fontSize={14}
              onClick={() => changeToReserve()}
              className={cls(
                "hover:scale-150",
                reservation.state === ReservationState.Reserved
                  ? "scale-125"
                  : "opacity-50"
              )}
            />
            <FontAwesomeIcon
              icon={faBan}
              fontSize={14}
              onClick={() => changeToCancel()}
              className={cls(
                "hover:scale-150",
                reservation.state === ReservationState.Canceled
                  ? "scale-125"
                  : "opacity-50"
              )}
            />
            <FontAwesomeIcon
              icon={faCommentSlash}
              fontSize={14}
              onClick={() => changeToNoshow()}
              className={cls(
                "hover:scale-150",
                reservation.state === ReservationState.NoShow
                  ? "scale-125"
                  : "opacity-50"
              )}
            />
          </div>
        </span>
      </div>

      <div className="grid grid-cols-[5rem,1fr] items-center">
        <span className="">마지막 수정</span>
        <span>{reservation.lastModifier?.name}</span>
      </div>

      <div>
        <span className="">메모</span>
        <p className="pl-4">{reservation.memo}</p>
      </div>
    </div>
  );
};
