import { faQuestion, faRotateBack } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { ModalPortal } from "../components/mordal-portal";
import { Name } from "../components/name";
import { Patient } from "../components/patient";
import {
  DeleteReservationMutation,
  EditReservationMutation,
  ReservationState,
  useDeleteReservationMutation,
  useEditReservationMutation,
  useFindReservationByIdQuery,
} from "../graphql/generated/graphql";
import { getHHMM, getTimeLength, getYMD } from "../libs/utils";

export const ReservationDetail = () => {
  const navigate = useNavigate();
  const [openPatient, setOpenPatient] = useState<boolean>(false);
  const { id } = useParams();
  const reservationId = Number(id);

  const onCompleted = (data: DeleteReservationMutation) => {
    const {
      deleteReservation: { ok },
    } = data;
    if (ok) {
      navigate(-1);
    }
  };

  const onCompletedEdit = (data: EditReservationMutation) => {
    const {
      editReservation: { ok },
    } = data;
    if (ok) {
      navigate(-1);
    }
  };

  const [editReservationMutation] = useEditReservationMutation({
    onCompleted: onCompletedEdit,
  });

  const [deleteReservationMutation] = useDeleteReservationMutation({
    onCompleted,
  });

  const { data } = useFindReservationByIdQuery({
    variables: {
      input: {
        reservationId: reservationId,
      },
    },
  });
  const onClickEditNoshow = () => {
    const confirmDelete = window.confirm("예약을 취소합니다.");
    if (confirmDelete) {
      editReservationMutation({
        variables: {
          input: { reservationId, state: ReservationState.Canceled },
        },
      });
    }
  };
  const onClickEditCancel = () => {
    const confirmDelete = window.confirm("예약을 부도처리 합니다.");
    if (confirmDelete) {
      editReservationMutation({
        variables: {
          input: { reservationId, state: ReservationState.Canceled },
        },
      });
    }
  };
  const onClickDelete = () => {
    const confirmDelete = window.confirm("예약을 지웁니다.");
    if (confirmDelete) {
      deleteReservationMutation({ variables: { input: { reservationId } } });
    }
  };

  const reservation = data?.findReservationById.reservation;
  return (
    <ModalPortal>
      <Helmet>
        <title>예약 | Muool</title>
      </Helmet>
      <div className="bg-white py-6 px-16 sm:rounded-lg">
        <button
          className="absolute right-6 hover:text-gray-400"
          onClick={() => navigate(-1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <h4 className="mb-5 text-left text-3xl font-medium">예약 자세히</h4>
        <div className="mb-5 flex justify-around">
          <button className="rounded-md px-2 font-medium text-gray-500 shadow-cst">
            차트
          </button>
          <button
            onClick={onClickEditNoshow}
            className="rounded-md px-2 font-medium text-gray-500 shadow-cst"
          >
            부도
          </button>
          <button
            onClick={onClickEditCancel}
            className="rounded-md px-2 font-medium text-gray-500 shadow-cst"
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
          <div className="flex max-w-sm flex-col space-y-4">
            <div className="flex items-center justify-between gap-3">
              <Name
                id={reservation.id}
                birthday={reservation.patient.birthday}
                gender={reservation.patient.gender}
                name={reservation.patient.name}
                registrationNumber={reservation.patient.registrationNumber}
                columnCount={3}
              />
              {openPatient ? (
                <FontAwesomeIcon
                  icon={faRotateBack}
                  size={"xs"}
                  onClick={() => setOpenPatient(false)}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faQuestion}
                  size={"sm"}
                  onClick={() => setOpenPatient(true)}
                />
              )}
            </div>
            {openPatient ? (
              <Patient
                birthday={reservation.patient.birthday}
                gender={reservation.patient.gender}
                name={reservation.patient.name}
                registrationNumber={reservation.patient.registrationNumber}
              />
            ) : (
              <>
                <div>
                  <h4 className="text-sm text-gray-500">예약시각</h4>
                  <div className="space-x-4">
                    <span>
                      {getYMD(reservation.startDate, "yyyymmdd", "-")}
                    </span>
                    <span>
                      {getHHMM(reservation.startDate, ":")}
                      {" ~ "}
                      {getHHMM(reservation.endDate, ":")}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">치료시간</h4>
                  <span>
                    {getTimeLength(reservation.startDate, reservation.endDate)}
                    분
                  </span>
                </div>

                <div>
                  <h4 className="text-sm text-gray-500">상태</h4>
                  <span>{reservation.state}</span>
                </div>

                <div>
                  <h4 className="text-sm text-gray-500">마지막 수정</h4>
                  <span>{reservation.lastModifier.email}</span>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">치료사</h4>
                  <span>{reservation.therapist.email}</span>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">그룹</h4>
                  <span>{reservation.group?.name}</span>
                </div>
                <div>
                  <h4 className="text-sm text-gray-500">메모</h4>
                  <p>{reservation.memo ? reservation.memo : ""}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </ModalPortal>
  );
};
