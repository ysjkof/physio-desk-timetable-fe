import {
  faQuestion,
  faRotateBack,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { SearchName } from "../../components/search-name";
import { Patient } from "../../components/patient";
import {
  FindReservationByIdDocument,
  FindReservationByIdQuery,
  ReservationState,
  useDeleteReservationMutation,
  useEditReservationMutation,
} from "../../graphql/generated/graphql";
import { getHHMM, getTimeLength, getYMD } from "../../libs/timetable-utils";
import { cls } from "../../libs/utils";
import { client } from "../../apollo";
import { useLocation, useNavigate } from "react-router-dom";
import { useListReservations } from "../../hooks/useListReservations";
import { TIMETABLE } from "../../variables";

function changeState(
  state: ReservationState,
  reservationId: number,
  clinicId: number | undefined
) {
  const thisReservation: FindReservationByIdQuery | null =
    client.cache.readQuery({
      query: FindReservationByIdDocument,
      variables: {
        input: {
          reservationId,
          ...(clinicId && { clinicId }),
        },
      },
    });
  if (thisReservation === null) {
    console.error("❌ thisReservation is FALSE");
  } else {
    client.cache.writeQuery({
      query: FindReservationByIdDocument,
      data: {
        findReservationById: {
          __typename: "FindReservationByIdOutput",
          error: null,
          ok: true,
          reservation: {
            ...thisReservation.findReservationById.reservation,
            state,
          },
        },
      },
    });
  }
}

interface ReservationDetailProps {
  refetch: () => void;
}

export const ReservationDetail = ({ refetch }: ReservationDetailProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  //@ts-ignore
  const reservationId = location.state?.reservationId;

  const [openPatientDetail, setOpenPatientDetail] = useState<boolean>(false);
  const [editReservationMutation] = useEditReservationMutation({});
  const [deleteReservationMutation] = useDeleteReservationMutation({});
  let nextState: ReservationState;

  const { data } = useListReservations();

  const onClickEditNoshow = () => {
    const confirmDelete = window.confirm("예약을 부도처리합니다.");
    if (confirmDelete) {
      nextState =
        reservation?.state === ReservationState.NoShow
          ? ReservationState.Reserved
          : ReservationState.NoShow;
      editReservationMutation({
        variables: {
          input: {
            reservationId,
            state: nextState,
            ...(reservation?.clinic?.id && { clinicId: reservation.clinic.id }),
          },
        },
        onCompleted(data) {
          const {
            editReservation: { ok },
          } = data;
          if (ok) {
            changeState(
              nextState,
              reservationId,
              reservation?.clinic?.id && reservation.clinic.id
            );
            return;
          }
        },
      });
    }
  };
  const onClickEditCancel = () => {
    const confirmDelete = window.confirm("예약을 취소 합니다.");
    if (confirmDelete) {
      nextState =
        reservation?.state === ReservationState.Canceled
          ? ReservationState.Reserved
          : ReservationState.Canceled;
      editReservationMutation({
        variables: {
          input: {
            reservationId,
            state: nextState,
            ...(reservation?.clinic?.id && { clinicId: reservation.clinic.id }),
          },
        },
        onCompleted(data) {
          const {
            editReservation: { ok },
          } = data;
          if (ok) {
            changeState(
              nextState,
              reservationId,
              reservation?.clinic?.id && reservation.clinic.id
            );
            return;
          }
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

  const reservation = data?.listReservations.results?.find(
    (r) => r.id === reservationId
  );
  return (
    <div className=" relative top-32 z-[300] mx-auto h-[600px] w-[400px] overflow-y-scroll bg-white py-6 px-16 sm:rounded-lg">
      <button
        className="absolute right-6 hover:text-gray-400"
        onClick={() => navigate(TIMETABLE)}
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
                  <span>{getYMD(reservation.startDate, "yyyymmdd", "-")}</span>
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
                  {getTimeLength(reservation.startDate, reservation.endDate)}분
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
                <span>{reservation.user.name}</span>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">그룹</h4>
                <span>{reservation.clinic?.name}</span>
              </div>
              <div>
                <h4 className="text-sm text-gray-500">메모</h4>
                <p>{reservation.memo && reservation.memo}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
