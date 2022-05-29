import { Helmet } from "react-helmet-async";
import {
  Prescription,
  useFindPrescriptionsQuery,
} from "../../graphql/generated/graphql";
import { useReactiveVar } from "@apollo/client";
import { selectedClinicVar } from "../../store";
import { useListReservations } from "../../hooks/useListReservations";
import { TimetableLayout } from "./table-layout";
export interface PrescriptionWithSelect extends Prescription {
  isSelect: boolean;
}

export const TimeTable = () => {
  const selectedClinic = useReactiveVar(selectedClinicVar);

  const { data, refetch } = useListReservations();

  const { data: prescriptionsData } = useFindPrescriptionsQuery({
    variables: {
      input: {
        includeInactivate: false,
        clinicId: selectedClinic.id,
      },
    },
  });

  let prescriptions: PrescriptionWithSelect[] = [];

  if (prescriptionsData) {
    Array.isArray(prescriptionsData.findPrescriptions.prescriptions) &&
      (prescriptions = prescriptionsData.findPrescriptions.prescriptions.map(
        (presc) => ({ ...presc, isSelect: false })
      ));
  }

  if (!data) return <></>;
  return (
    <>
      <Helmet>
        <title>시간표 | Muool</title>
      </Helmet>
      <TimetableLayout
        prescriptions={prescriptions}
        refetch={refetch}
        eventsData={data}
      />
    </>
  );
};
