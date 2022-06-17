import { makeVar } from "@apollo/client";
import {
  Clinic,
  FindMyClinicsQuery,
  ListReservationsQuery,
  Patient,
  Prescription,
} from "./graphql/generated/graphql";
import { ModifiedLoggedInUser } from "./hooks/useMe";
import { ONE_DAY, ONE_WEEK } from "./variables";

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

// typescript type & interface
export type IFindMyClinics = FindMyClinicsQuery["findMyClinics"]["clinics"];
export type IClinic = NonNullable<FlatArray<IFindMyClinics, 0>>;

export type IMember = IClinic["members"][0];
export type IMemberWithActivate = IMember & { isActivate: boolean };

export interface IClinicList extends Omit<IClinic, "members"> {
  members: IMemberWithActivate[];
}
export type IListReservation = NonNullable<
  ListReservationsQuery["listReservations"]["results"]
>[0];

export interface PrescriptionWithSelect extends Prescription {
  isSelect: boolean;
}

export interface ISelectedClinic extends Pick<Clinic, "id" | "name" | "type"> {
  isManager: IMember["manager"];
  isStayed: IMember["staying"];
  members: IMemberWithActivate[];
}

// global state
export const queryResultVar = makeVar<ListReservationsQuery | undefined>(
  undefined
);

export const todayNowVar = makeVar<Date>(new Date());
export const loggedInUserVar = makeVar<ModifiedLoggedInUser | null>(null);

export const viewOptionsVar = makeVar<IViewOption>(defaultViewOptions);
export const clinicListsVar = makeVar<IClinicList[]>([]); // member의 activated key를 저장하기 위해서 필요함.

export const selectedDateVar = makeVar(new Date());
export const selectedClinicVar = makeVar<ISelectedClinic | null>(null);
export const selectedPatientVar = makeVar<null | SelectedPatient>(null);
