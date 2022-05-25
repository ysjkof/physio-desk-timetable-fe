import { Helmet } from "react-helmet-async";
import { Timetable } from "./timetable";
import {
  Prescription,
  useFindPrescriptionsQuery,
  useListReservationsQuery,
} from "../../graphql/generated/graphql";
import { useReactiveVar } from "@apollo/client";
import {
  clinicListsVar,
  selectedClinicVar,
  selectedDateVar,
} from "../../store";
import { getEnddate, getStartSunday } from "../../libs/timetable-utils";
export interface PrescriptionWithSelect extends Prescription {
  isSelect: boolean;
}

export const TimeTable = () => {
  const selectedClinic = useReactiveVar(selectedClinicVar);
  const selectedDate = useReactiveVar(selectedDateVar);
  const clinicLists = useReactiveVar(clinicListsVar);

  const { data, refetch } = useListReservationsQuery({
    variables: {
      input: {
        startDate: getStartSunday(selectedDate),
        endDate: getEnddate(getStartSunday(selectedDate), 7),
        ...(selectedClinic.id !== 0 && {
          userIds: clinicLists
            .find((g) => g.id === selectedClinic.id)
            ?.members.filter((m) => m.activation)
            .map((m) => m.user.id),
          clinicId: selectedClinic.id,
        }),
      },
    },
  });
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
      <div className="container mx-auto h-full">
        <div className="relative h-[1050px]">
          <Timetable
            tableTime={{
              start: { hours: 9, minutes: 0 },
              end: { hours: 19, minutes: 0 },
            }}
            eventsData={data}
            prescriptions={prescriptions}
            refetch={refetch}
          />
        </div>
      </div>
    </>
  );
};
