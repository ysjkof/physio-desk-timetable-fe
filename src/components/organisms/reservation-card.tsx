import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { ReservationCardName } from "../molecules/reservation-card-name";
import { ReservationCardPatientDetail } from "../molecules/reservation-card-patient-detail";
import { TimetableModalProps } from "../../pages/timetable";
import { useListReservations } from "../../hooks/useListReservations";
import {
  ReservationState,
  useDeleteReservationMutation,
  useEditReservationMutation,
} from "../../graphql/generated/graphql";
import { ModalContentsLayout } from "../templates/modal-contents-layout";
import { ReservationCardDetail } from "../molecules/reservation-card-detail";
import { BtnMenuToggle } from "../molecules/button-menu-toggle";
import { BtnMenu } from "../molecules/button-menu";
import { ModalTemplate } from "../molecules/modal-template";
import { ReserveForm } from "../../pages/timetable/molecules/reserve-form";

export const ReservationCard = ({
  closeAction,
  refetch,
}: TimetableModalProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  //@ts-ignore
  const reservationId = location.state?.reservationId;
  const [subMenu, setSubMenu] = useState<"reservation" | "patient" | "edit">(
    "reservation"
  );

  const { data } = useListReservations();
  const reservation = data?.listReservations.results?.find(
    (r) => r.id === reservationId
  )!;

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
            closeAction();
          }
        },
      });
    }
  };

  return reservation ? (
    <ModalTemplate
      closeAction={closeAction}
      children={
        <ModalContentsLayout
          title="예약 자세히"
          closeAction={closeAction}
          children={
            <>
              {!reservation ? (
                <p>
                  데이터가 없습니다. 돌아가서 다시 시도해주세요
                  <button
                    className="btn-menu mx-auto block font-semibold"
                    onClick={() => navigate(-1)}
                  >
                    누르세요
                  </button>
                </p>
              ) : (
                <>
                  <h4 className="mb-5 text-left font-medium"></h4>
                  <ReservationCardName
                    birthday={reservation.patient.birthday}
                    gender={reservation.patient.gender}
                    name={reservation.patient.name}
                    registrationNumber={reservation.patient.registrationNumber}
                  />
                  <div className="reservation-editor flex justify-around py-2">
                    <BtnMenu
                      icon={<FontAwesomeIcon icon={faBan} fontSize={14} />}
                      enabled={reservation.state === ReservationState.Canceled}
                      label={"취소"}
                      onClick={() =>
                        onClickEditReserve(ReservationState.Canceled)
                      }
                    />
                    <BtnMenu
                      icon={
                        <FontAwesomeIcon icon={faCommentSlash} fontSize={14} />
                      }
                      enabled={reservation.state === ReservationState.NoShow}
                      label={"부도"}
                      onClick={() =>
                        onClickEditReserve(ReservationState.NoShow)
                      }
                    />
                    <BtnMenu
                      icon={<FontAwesomeIcon icon={faTrashCan} fontSize={14} />}
                      enabled
                      label={"삭제"}
                      onClick={onClickDelete}
                    />
                    <BtnMenu
                      icon={
                        <FontAwesomeIcon icon={faPenToSquare} fontSize={14} />
                      }
                      enabled
                      label={"수정"}
                      onClick={() =>
                        setSubMenu((prev) =>
                          prev !== "edit" ? "edit" : "reservation"
                        )
                      }
                    />
                  </div>
                  <BtnMenuToggle
                    firstEnabled={subMenu === "reservation"}
                    secondEnabled={subMenu === "patient"}
                    label={["예약", "환자정보"]}
                    width={"full"}
                    onClick={() =>
                      setSubMenu((prev) =>
                        prev === "reservation" ? "patient" : "reservation"
                      )
                    }
                  />
                  {subMenu === "reservation" ? (
                    <ReservationCardDetail reservation={reservation} />
                  ) : subMenu === "edit" ? (
                    <ReserveForm
                      closeAction={() => setSubMenu("reservation")}
                      selectedPrescriptionData={reservation.prescriptions?.map(
                        (prev) => ({ ...prev, isSelect: true })
                      )}
                      reservation={reservation}
                      refetch={() => null}
                    />
                  ) : (
                    <ReservationCardPatientDetail
                      birthday={reservation.patient.birthday}
                      gender={reservation.patient.gender}
                      name={reservation.patient.name}
                      registrationNumber={
                        reservation.patient.registrationNumber
                      }
                      memo={reservation.patient.memo}
                    />
                  )}
                </>
              )}
            </>
          }
        />
      }
    />
  ) : null;
};
