import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Timetable } from "../components/timetable";
import {
  useFindPrescriptionsQuery,
  useListReservationsQuery,
} from "../graphql/generated/graphql";
import { useReactiveVar } from "@apollo/client";
import { focusGroupVar, todayVar } from "../store";
import { useMe } from "../hooks/useMe";

interface PrscriptionBundle {
  __typename?: "PrescriptionBundle";
  id: number;
  name: string;
  requiredTime: number;
  description?: string | null;
  price: number;
  activate: boolean;
  prescriptionOptions: {
    __typename?: "PrescriptionOption";
    id: number;
    name: string;
    requiredTime: number;
    description?: string | null;
    price: number;
    activate: boolean;
    prescription: { __typename?: "PrescriptionAtom"; name: string };
  }[];
}
interface PrescriptionOption {
  __typename?: "PrescriptionOption" | undefined;
  id: number;
  name: string;
  requiredTime: number;
  description?: string | null | undefined;
  price: number;
  activate: boolean;
  prescription: {
    __typename?: "PrescriptionAtom" | undefined;
    name: string;
  };
}
export interface PrscriptionBundleWithSelect extends PrscriptionBundle {
  isSelect: boolean;
}
export interface PrescriptionOptionWithSelect extends PrescriptionOption {
  isSelect: boolean;
}
export interface PrescriptionsSelectType {
  bundle: PrscriptionBundleWithSelect[];
  option: PrescriptionOptionWithSelect[];
}

export const TimeTable = () => {
  const today = useReactiveVar(todayVar);
  const focusGroup = useReactiveVar(focusGroupVar);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const { data: meData } = useMe();

  const { data } = useListReservationsQuery({
    variables: {
      input: {
        date: selectedDate,
        viewOption: 7,
        groupIds:
          meData?.me.groups && meData.me.groups.length >= 1
            ? meData.me.groups.map((group) => group.group.id)
            : null,
      },
    },
  });
  const { data: prescriptionsData } = useFindPrescriptionsQuery({
    variables: {
      input: {
        includeInactivate: false,
        prescriptionType: "all",
        groupId: focusGroup?.id,
      },
    },
  });
  let prescriptions: PrescriptionsSelectType = { bundle: [], option: [] };
  if (prescriptionsData) {
    Array.isArray(prescriptionsData.findPrescriptions.bundleResults) &&
      Array.isArray(prescriptionsData.findPrescriptions.optionResults) &&
      (prescriptions = {
        bundle: prescriptionsData.findPrescriptions.bundleResults.map(
          (bundle) => ({ ...bundle, isSelect: false })
        ),
        option: prescriptionsData.findPrescriptions.optionResults.map(
          (bundle) => ({ ...bundle, isSelect: false })
        ),
      });
  }

  if (!meData) {
    return <></>;
  }
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
            selectedDateState={{ selectedDate, setSelectedDate }}
            loginUser={meData}
            prescriptions={prescriptions}
          />
        </div>
      </div>
    </>
  );
};
