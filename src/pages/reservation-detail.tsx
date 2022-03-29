import {
  faQuestion,
  faRotateBack,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
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
import { cls, getHHMM, getTimeLength, getYMD } from "../libs/utils";

interface IReservationDetail {
  reservationId: number;
  closeAction: any;
}
export const ReservationDetail = ({
  reservationId,
  closeAction,
}: IReservationDetail) => {
  const navigate = useNavigate();
  const [openPatientDetail, setOpenPatientDetail] = useState<boolean>(false);

  const onCompleted = (data: DeleteReservationMutation) => {
    const {
      deleteReservation: { ok },
    } = data;
    if (ok) {
      // 캐시 수정해서 변경사항 바로 렌더링하기
      return closeAction();
    }
  };

  const onCompletedEdit = (data: EditReservationMutation) => {
    const {
      editReservation: { ok },
    } = data;
    if (ok) {
      // 캐시 수정해서 변경사항 바로 렌더링하기
      return;
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
    const confirmDelete = window.confirm("예약을 부도처리합니다.");
    if (confirmDelete) {
      let state: ReservationState;
      reservation?.state === ReservationState.NoShow
        ? (state = ReservationState.Reserved)
        : (state = ReservationState.NoShow);
      editReservationMutation({
        variables: {
          input: { reservationId, state },
        },
      });
    }
  };
  const onClickEditCancel = () => {
    const confirmDelete = window.confirm("예약을 취소 합니다.");
    if (confirmDelete) {
      let state: ReservationState;

      reservation?.state === ReservationState.Canceled
        ? (state = ReservationState.Reserved)
        : (state = ReservationState.Canceled);
      console.log(reservation?.state);
      console.log(state);
      editReservationMutation({
        variables: {
          input: { reservationId, state },
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
    <>
      <Helmet>
        <title>예약 | Muool</title>
      </Helmet>
      <div className="h-[550px] w-[400px] overflow-y-scroll bg-white py-6 px-16 sm:rounded-lg">
        <button
          className="absolute right-6 hover:text-gray-400"
          onClick={() => closeAction()}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h4 className="mb-5 text-left text-3xl font-medium">예약 자세히</h4>
        <div className="mb-5 flex justify-around">
          <button className="rounded-md px-2 font-medium text-gray-500 shadow-cst">
            차트
          </button>
          <button
            onClick={onClickEditNoshow}
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
            onClick={onClickEditCancel}
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
          <div className="flex max-w-sm flex-col space-y-4">
            <div className="relative flex items-center justify-between gap-3 pr-5">
              <Name
                id={reservation.id}
                birthday={reservation.patient.birthday}
                gender={reservation.patient.gender}
                name={reservation.patient.name}
                registrationNumber={reservation.patient.registrationNumber}
                columnCount={3}
              />
              <div className="absolute right-0">
                {openPatientDetail ? (
                  <FontAwesomeIcon
                    icon={faRotateBack}
                    size={"xs"}
                    onClick={() => setOpenPatientDetail(false)}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faQuestion}
                    size={"sm"}
                    onClick={() => setOpenPatientDetail(true)}
                  />
                )}
              </div>
            </div>
            {openPatientDetail ? (
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
    </>
  );
};
