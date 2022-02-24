import { gql, useQuery, useReactiveVar } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { selectedPatientVar } from "../libs/variables";
import { ModalPortal } from "../components/mordal-portal";
import {
  findReservationById,
  findReservationByIdVariables,
} from "../__generated__/findReservationById";
import { NameTag } from "../components/name-tag";
import { getHHMM, getTimeLength } from "../libs/utils";

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
        <h4 className="mb-5 w-full text-left text-3xl font-medium">예약하기</h4>
        {reservation && (
          <div className="flex flex-col space-y-4">
            <NameTag
              id={reservation.id}
              birthday={reservation.patient.birthday}
              gender={reservation.patient.gender}
              name={reservation.patient.name}
              registrationNumber={reservation.patient.registrationNumber}
            />

            <span>{reservation.startDate}</span>
            <span>{reservation.endDate}</span>
            <div>
              <span>치료시간 : </span>
              <span>
                {getTimeLength(reservation.startDate, reservation.endDate)}
              </span>
            </div>

            <div>
              <span>상태 : </span>
              <span>{reservation.state}</span>
            </div>

            <div>
              <span>마지막 수정 : </span>
              <span>{reservation.lastModifier.email}</span>
            </div>
            <div>
              <span>치료사 : </span>
              <span>{reservation.therapist.email}</span>
            </div>
            <div>
              <span>그룹 :</span>
              <span>{reservation.group?.name}</span>
            </div>
            <span>{reservation.memo}</span>
          </div>
        )}
      </div>
    </ModalPortal>
  );
};
