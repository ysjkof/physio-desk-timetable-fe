import { useReactiveVar } from "@apollo/client";
import { useListReservationsQuery } from "../graphql/generated/graphql";
import { getEnddate, getStartSunday } from "../libs/timetable-utils";
import { clinicListsVar, selectedClinicVar, selectedDateVar } from "../store";

export const useListReservations = () => {
  const selectedClinic = useReactiveVar(selectedClinicVar);
  const selectedDate = useReactiveVar(selectedDateVar);
  const clinicLists = useReactiveVar(clinicListsVar);

  return useListReservationsQuery({
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
};
