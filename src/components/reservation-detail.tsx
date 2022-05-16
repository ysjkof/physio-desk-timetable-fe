import { useReactiveVar } from "@apollo/client";
import {
  faQuestion,
  faRotateBack,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { SearchName } from "./search-name";
import { Patient } from "./patient";
import {
  DeleteReservationMutation,
  EditReservationMutation,
  FindReservationByIdDocument,
  ReservationState,
  useDeleteReservationMutation,
  useEditReservationMutation,
  useFindReservationByIdQuery,
} from "../graphql/generated/graphql";
import { getHHMM, getTimeLength, getYMD } from "../libs/timetable-utils";
import { cls } from "../libs/utils";
import { listReservationRefetchVar } from "../store";

interface IReservationDetail {
  reservationId: number;
  closeAction: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ReservationDetail: React.FC<IReservationDetail> = ({
  reservationId,
  closeAction,
}) => {
  const navigate = useNavigate();
  const [openPatientDetail, setOpenPatientDetail] = useState<boolean>(false);
  const listReservationRefetch = useReactiveVar(listReservationRefetchVar);

  const onCompleted = (data: DeleteReservationMutation) => {
    const {
      deleteReservation: { ok },
    } = data;
    if (ok) {
      // 캐시 수정해서 변경사항 바로 렌더링하기
      listReservationRefetch();
      closeAction(false);
    }
  };

  const onCompletedEdit = (data: EditReservationMutation) => {
    const {
      editReservation: { ok },
    } = data;
    if (ok) {
      return;
    }
  };

  const [editReservationMutation] = useEditReservationMutation({
    onCompleted: onCompletedEdit,
  });

  const [deleteReservationMutation] = useDeleteReservationMutation({
    onCompleted,
  });

  const { data: findReservationData } = useFindReservationByIdQuery({
    variables: {
      input: {
        reservationId,
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
        update: (cache) => {
          cache.writeQuery({
            query: FindReservationByIdDocument,
            data: {
              findReservationById: {
                __typename: "FindReservationByIdOutput",
                error: null,
                ok: true,
                reservation: {
                  __typename: reservation?.__typename,
                  endDate: reservation?.endDate,
                  group: reservation?.group,
                  id: reservation?.id,
                  lastModifier: reservation?.lastModifier,
                  memo: reservation?.memo,
                  patient: reservation?.patient,
                  startDate: reservation?.startDate,
                  state,
                  therapist: reservation?.therapist,
                },
              },
            },
          });
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
      editReservationMutation({
        variables: {
          input: { reservationId, state },
        },
        update: (cache) => {
          cache.writeQuery({
            query: FindReservationByIdDocument,
            data: {
              findReservationById: {
                __typename: "FindReservationByIdOutput",
                error: null,
                ok: true,
                reservation: {
                  __typename: reservation?.__typename,
                  endDate: reservation?.endDate,
                  group: reservation?.group,
                  id: reservation?.id,
                  lastModifier: reservation?.lastModifier,
                  memo: reservation?.memo,
                  patient: reservation?.patient,
                  startDate: reservation?.startDate,
                  state,
                  therapist: reservation?.therapist,
                },
              },
            },
          });
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

  const reservation = findReservationData?.findReservationById.reservation;
  return (
    <>
      <Helmet>
        <title>예약 | Muool</title>
      </Helmet>
      <div className="h-[550px] w-[400px] overflow-y-scroll bg-white py-6 px-16 sm:rounded-lg">
        <button
          className="absolute right-6 hover:text-gray-400"
          onClick={() => closeAction(false)}
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
              <SearchName
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
                  <span>{reservation.lastModifier?.email}</span>
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
