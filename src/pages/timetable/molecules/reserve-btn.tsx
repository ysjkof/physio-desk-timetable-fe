import { useReactiveVar } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import {
  ListReservationsDocument,
  useCreateReservationMutation,
} from "../../../graphql/generated/graphql";
import { getHHMM } from "../../../libs/timetable-utils";
import { selectedReservationVar } from "../../../store";
import { RESERVE_DETAIL } from "../../../variables";

interface ReserveBtnProps {
  label: Date;
  member: { id: number; name: string };
  isActiveBorderTop?: boolean;
}

export const ReserveBtn = ({
  label,
  member,
  isActiveBorderTop = false,
}: ReserveBtnProps) => {
  const selectedReservation = useReactiveVar(selectedReservationVar);
  const navigate = useNavigate();

  const [createReservationMutation, { loading }] =
    useCreateReservationMutation();

  return (
    <div
      className={`reserve-btn-box group ${
        isActiveBorderTop ? " border-t border-gray-200 first:border-t-0" : ""
      }`}
      onClick={() => {
        if (selectedReservation) {
          if (loading) return;
          // 할일: 예약복사 상태 나타내기, 예약 길이 표시하기 몇 칸 가능한지?
          type ReduceReturnType = {
            prescriptionIds: number[];
            requiredTime: number;
          };
          const reduceReturnType: ReduceReturnType = {
            prescriptionIds: [],
            requiredTime: 0,
          };
          const { prescriptionIds, requiredTime } =
            selectedReservation.prescriptions!.reduce((acc, prescription) => {
              return {
                prescriptionIds: [...acc.prescriptionIds, prescription.id],
                requiredTime: acc.requiredTime + prescription.requiredTime,
              };
            }, reduceReturnType);
          const endDate = new Date(label);
          endDate.setMinutes(endDate.getMinutes() + requiredTime);

          createReservationMutation({
            variables: {
              input: {
                clinicId: selectedReservation.clinic!.id,
                patientId: selectedReservation.patient.id,
                memo: selectedReservation.memo,
                userId: member.id,
                startDate: label,
                endDate,
                prescriptionIds,
              },
            },
            refetchQueries: [
              { query: ListReservationsDocument },
              "listReservations",
            ],
          });
          selectedReservationVar(null);
        } else {
          navigate(RESERVE_DETAIL, { state: { startDate: label, member } });
        }
      }}
    >
      <span className="reserve-btn">+ {getHHMM(label, ":")}</span>
    </div>
  );
};
