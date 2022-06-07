import { makeVar } from "@apollo/client";
import { ListReservationsQuery, Patient } from "./graphql/generated/graphql";
import { ModifiedLoggedInUser } from "./hooks/useMe";
import { ClinicWithOptions } from "./libs/timetable-utils";
import { ModifiedClinic } from "./pages/dashboard";
import { ONE_DAY, ONE_WEEK } from "./variables";

// 이곳에서 전역 변수 관리

export const queryResultVar = makeVar<ListReservationsQuery | undefined>(
  undefined
);

export interface SelectedPatient
  extends Pick<Patient, "name" | "gender" | "registrationNumber" | "birthday"> {
  id: number;
  clinicName: string;
  user?: { id: number; name: string };
}

export interface IViewOption {
  periodToView: typeof ONE_DAY | typeof ONE_WEEK;
  seeCancel: boolean;
  seeNoshow: boolean;
  seeList: boolean;
  seeActiveOption: boolean;
  navigationExpand: boolean;
  tableDuration: {
    start: { hours: number; minutes: number };
    end: { hours: number; minutes: number };
  };
}
const defaultViewOptions: IViewOption = {
  periodToView: ONE_WEEK,
  seeCancel: true,
  seeNoshow: true,
  seeList: false,
  seeActiveOption: false,
  navigationExpand: false,
  tableDuration: {
    start: { hours: 9, minutes: 0 },
    end: { hours: 19, minutes: 0 },
  },
};

export const selecteMe = {
  id: 0,
  name: "개인",
  isManager: true,
  isStayed: true,
};

export const todayNowVar = makeVar<Date>(new Date());
export const loggedInUserVar = makeVar<ModifiedLoggedInUser | null>(null);

export const viewOptionsVar = makeVar<IViewOption>(defaultViewOptions);
export const clinicListsVar = makeVar<ClinicWithOptions[]>([]); // member의 activated key를 저장하기 위해서 필요함.

export const selectedDateVar = makeVar(new Date());
export const selectedClinicVar = makeVar<ModifiedClinic>(selecteMe);
export const selectedPatientVar = makeVar<null | SelectedPatient>(null);
