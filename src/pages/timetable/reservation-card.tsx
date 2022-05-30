import { faCaretDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { ReservationCardPatientDetail } from "./components/reservation-card-patient-detail";
import {
  ReservationState,
  useDeleteReservationMutation,
  useEditReservationMutation,
} from "../../graphql/generated/graphql";
import { cls } from "../../libs/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { useListReservations } from "../../hooks/useListReservations";
import { TIMETABLE } from "../../variables";
import { motion } from "framer-motion";
import { ReservationCardName } from "./components/reservation-card-name";
import { ReservationCardDetail } from "./components/reservation-card-detail";

interface ReservationCardProps {
  refetch: () => void;
}

export const ReservationCard = ({ refetch }: ReservationCardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  //@ts-ignore
  const reservationId = location.state?.reservationId;
  const [isReservation, setIsReservation] = useState<boolean>(true);
  const { data } = useListReservations();

  const reservation = data?.listReservations.results?.find(
    (r) => r.id === reservationId
  );

  const [editReservationMutation] = useEditReservationMutation({
    update(cache) {
      if (!reservation) return console.error("reservation이 없습니다");
      const myReserv = cache.identify(reservation);
      cache.modify({
        id: myReserv,
        fields: {
          state() {},
        },
      });
    },
  });
  const [deleteReservationMutation] = useDeleteReservationMutation({});

  const onClickEditReserve = (stateType: ReservationState) => {
    const confirmDelete = window.confirm(`예약을 ${stateType}처리합니다.`);
    if (confirmDelete) {
      const nextState =
        reservation?.state === stateType
          ? ReservationState.Reserved
          : stateType;
      editReservationMutation({
        variables: {
          input: {
            reservationId,
            state: nextState,
            ...(reservation?.clinic?.id && { clinicId: reservation.clinic.id }),
          },
        },
      });
    }
  };

  const onClickDelete = () => {
    const confirmDelete = window.confirm("예약을 지웁니다.");
    if (confirmDelete) {
      deleteReservationMutation({
        variables: { input: { reservationId } },
        onCompleted(data) {
          const {
            deleteReservation: { ok },
          } = data;
          if (ok) {
            refetch();
            navigate(TIMETABLE);
          }
        },
      });
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={false}
      className="relative top-32 mx-auto h-[600px] w-[400px] space-y-4 overflow-y-scroll bg-white py-6 px-16 sm:rounded-lg"
    >
      <button
        className="absolute right-6 hover:text-gray-400"
        onClick={() => navigate(TIMETABLE)}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
      <h4 className="mb-5 text-left font-medium">예약 자세히</h4>
      <div className="reservation-editor mb-5 flex justify-around">
        {/* <button className="rounded-md px-2 font-medium text-gray-500 shadow-cst">
     차트
    </button> */}
        <button
          onClick={() => onClickEditReserve(ReservationState.NoShow)}
          className={cls(
            reservation?.state === ReservationState.NoShow
              ? "bg-yellow-100"
              : "",
            "rounded-md px-2 font-medium text-gray-500 shadow-cst"
          )}
        >
          부도
        </button>
        <button
          onClick={() => onClickEditReserve(ReservationState.Canceled)}
          className={cls(
            reservation?.state === ReservationState.Canceled
              ? "bg-red-100 text-white"
              : "",
            "rounded-md px-2 font-medium text-gray-500 shadow-cst"
          )}
        >
          취소
        </button>
        <button
          className="rounded-md px-2 font-medium text-gray-500 shadow-cst"
          onClick={onClickDelete}
        >
          삭제
        </button>
      </div>
      {reservation && (
        <>
          <ReservationCardName
            birthday={reservation.patient.birthday}
            gender={reservation.patient.gender}
            name={reservation.patient.name}
            registrationNumber={reservation.patient.registrationNumber}
          />
          <div className="flex justify-around border-b-2 border-transparent">
            <button
              className={cls(
                "relative w-full border-b-2 py-1 px-4",
                isReservation ? "border-blue-500" : "border-transparent"
              )}
              onClick={() => setIsReservation(true)}
            >
              예약
            </button>
            <button
              className={cls(
                "relative w-full border-b-2 py-1 px-4",
                isReservation ? "border-transparent" : "border-blue-500"
              )}
              onClick={() => setIsReservation(false)}
            >
              환자 정보
            </button>
          </div>
          {isReservation ? (
            <ReservationCardDetail reservation={reservation} />
          ) : (
            <ReservationCardPatientDetail
              birthday={reservation.patient.birthday}
              gender={reservation.patient.gender}
              name={reservation.patient.name}
              registrationNumber={reservation.patient.registrationNumber}
              memo={reservation.patient.memo}
            />
          )}
        </>
      )}
    </motion.div>
  );
};
