import { useReactiveVar } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ListReservationsDocument,
  useCreateReservationMutation,
} from "../../../graphql/generated/graphql";
import { getHHMM, getTimeLength } from "../../../libs/timetable-utils";
import { IListReservation, selectedReservationVar } from "../../../store";
import {
  RESERVE_DETAIL,
  TABLE_CELL_HEIGHT,
  USER_COLORS,
} from "../../../variables";

interface ReserveBtnProps {
  label: Date;
  member: { id: number; name: string };
  userIndex: number;
  isActiveBorderTop?: boolean;
}

function getPrescriptionInfo(reservation: IListReservation) {
  type ReturnType = {
    prescriptionIds: number[];
    requiredTime: number;
  };
  const reduceReturnType: ReturnType = {
    prescriptionIds: [],
    requiredTime: 0,
  };
  const { prescriptionIds, requiredTime } = reservation.prescriptions!.reduce(
    (acc, prescription) => {
      return {
        prescriptionIds: [...acc.prescriptionIds, prescription.id],
        requiredTime: acc.requiredTime + prescription.requiredTime,
      };
    },
    reduceReturnType
  );
  return { prescriptionIds, requiredTime };
}

export const ReserveBtn = ({
  label,
  member,
  userIndex,
  isActiveBorderTop = false,
}: ReserveBtnProps) => {
  const selectedReservation = useReactiveVar(selectedReservationVar);
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);

  const [createReservationMutation, { loading }] =
    useCreateReservationMutation();

  return (
    <div
      className={`reserve-btn-box group ${
        isActiveBorderTop ? " border-t border-gray-200 first:border-t-0" : ""
      }`}
      onMouseOver={(e) => {
        if (selectedReservation) setIsHover(true);
      }}
      onMouseLeave={(e) => {
        if (selectedReservation) setIsHover(false);
      }}
      onClick={() => {
        if (selectedReservation) {
          if (loading) return;
          const { prescriptionIds, requiredTime } =
            getPrescriptionInfo(selectedReservation);

          const endDate = new Date(label);
          endDate.setMinutes(endDate.getMinutes() + requiredTime);

          createReservationMutation({
            variables: {
              input: {
                clinicId: selectedReservation.clinic!.id,
                patientId: selectedReservation.patient!.id,
                memo: selectedReservation.memo,
                userId: member.id,
                startDate: label,
                endDate,
                prescriptionIds,
              },
            },
          });
          // 할일: 연속예약을 하기 위해서 키보드 조작으로 아래 동작 안하기
          selectedReservationVar(null);
        } else {
          navigate(RESERVE_DETAIL, { state: { startDate: label, member } });
        }
      }}
    >
      <span className="reserve-btn">+ {getHHMM(label, ":")}</span>
      {selectedReservation && isHover && (
        <div
          className="absolute top-0 w-full border-2"
          style={{
            borderColor: USER_COLORS[userIndex]?.deep ?? "black",
            height:
              getTimeLength(
                selectedReservation.startDate,
                selectedReservation.endDate,
                "20minute"
              ) *
                TABLE_CELL_HEIGHT +
              "px",
          }}
        />
      )}
    </div>
  );
};
