import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { selectedPatientVar } from "../libs/variables";
import { ModalPortal } from "../components/mordal-portal";
import { NameTag } from "../components/name-tag";
import { getHHMM, getTimeLength, getYMD } from "../libs/utils";
import {
  deleteReservationMutation,
  deleteReservationMutationVariables,
} from "../__generated__/deleteReservationMutation";
import {
  findReservationById,
  findReservationByIdVariables,
} from "../__generated__/findReservationById";
import {
  editReservationMutation,
  editReservationMutationVariables,
} from "../__generated__/editReservationMutation";

const EDIT_RESERVATION_MUTATION = gql`
  mutation editReservationMutation($input: EditReservationInput!) {
    editReservation(input: $input) {
      error
      ok
    }
  }
`;
const DELETE_RESERVATION_MUTATION = gql`
  mutation deleteReservationMutation($input: DeleteReservationInput!) {
    deleteReservation(input: $input) {
      error
      ok
    }
  }
`;

const FIND_RESERVATION_BY_ID_QUERY = gql`
  query findReservationById($input: FindReservationByIdInput!) {
    findReservationById(input: $input) {
      error
      ok
      reservation {
        id
        startDate
        endDate
        state
        memo
        therapist {
          id
          email
        }
        patient {
          name
          gender
          registrationNumber
          birthday
        }
        group {
          id
          name
        }
        lastModifier {
          email
        }
      }
    }
  }
`;

export const ReservationDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const reservationId = Number(id);

  const onCompleted = (data: deleteReservationMutation) => {
    const {
      deleteReservation: { ok, error },
    } = data;
    if (ok) {
      navigate(-1);
    }
  };

  const onCompletedEdit = (data: editReservationMutation) => {
    const {
      editReservation: { ok, error },
    } = data;
    if (ok) {
      navigate(-1);
    }
  };

  const [editReservationMutation, { loading: editLoading, data: editData }] =
    useMutation<editReservationMutation, editReservationMutationVariables>(
      EDIT_RESERVATION_MUTATION,
      { onCompleted: onCompletedEdit }
    );

  const [
    deleteReservationMutation,
    { loading: deleteLoading, data: deleteData },
  ] = useMutation<
    deleteReservationMutation,
    deleteReservationMutationVariables
  >(DELETE_RESERVATION_MUTATION, { onCompleted });

  const { loading, data, error } = useQuery<
    findReservationById,
    findReservationByIdVariables
  >(FIND_RESERVATION_BY_ID_QUERY, {
    variables: {
      input: {
        reservationId: reservationId,
      },
    },
  });

  const onClickEdit = () => {
    // ToDo
    // editReservationMutation({ variables: { input: { reservationId } } });
  };
  const onClickDelete = () => {
    const confirmDelete = window.confirm("예약을 지우시겠습니까?");
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
          <button className="shadow-cst rounded-md px-2 font-medium text-gray-500">
            차트
          </button>
          <button
            onClick={onClickEdit}
            className="shadow-cst rounded-md px-2 font-medium text-gray-500"
          >
            부도
          </button>
          <button
            onClick={onClickEdit}
            className="shadow-cst rounded-md px-2 font-medium text-gray-500"
          >
            취소
          </button>
          <button
            className="shadow-cst rounded-md px-2 font-medium text-gray-500"
            onClick={onClickDelete}
          >
            삭제
          </button>
        </div>
        {reservation && (
          <div className="flex max-w-sm flex-col space-y-4">
            <NameTag
              id={reservation.id}
              birthday={reservation.patient.birthday}
              gender={reservation.patient.gender}
              name={reservation.patient.name}
              registrationNumber={reservation.patient.registrationNumber}
            />
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
          </div>
        )}
      </div>
    </ModalPortal>
  );
};
