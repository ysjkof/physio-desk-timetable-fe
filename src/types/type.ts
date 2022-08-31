import { VIEW_PERIOD } from '../constants/constants';
import { LocalStorageKey, LocalStorageValue } from '../constants/localStorage';
import {
  Clinic,
  FindMyClinicsQuery,
  GetStatisticsQuery,
  ListReservationsQuery,
  Member,
  MeQuery,
  Notice,
  Patient,
  Prescription,
  User,
} from '../graphql/generated/graphql';

export interface SelectedPatient
  extends Pick<Patient, 'name' | 'gender' | 'registrationNumber' | 'birthday'> {
  id: number;
  clinicName: string;
  user?: { id: number; name: string };
}
type ViewPeriodKey = keyof typeof VIEW_PERIOD;
type ViewPeriod = typeof VIEW_PERIOD[ViewPeriodKey];
export interface IViewOption {
  viewPeriod: ViewPeriod;
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

// typescript type & interface
export type IFindMyClinics = FindMyClinicsQuery['findMyClinics']['clinics'];
export type IClinic = NonNullable<FlatArray<IFindMyClinics, 0>>;

export type IMember = IClinic['members'][0];
export type IMemberWithActivate = IMember & { isActivate: boolean };

export interface IClinicList extends Omit<IClinic, 'members'> {
  members: IMemberWithActivate[];
}
export type IListReservation = NonNullable<
  ListReservationsQuery['listReservations']['results']
>[0];

export interface PrescriptionWithSelect extends Prescription {
  isSelect: boolean;
}

export interface ISelectedClinic extends Pick<Clinic, 'id' | 'name' | 'type'> {
  isManager: IMember['manager'];
  isStayed: IMember['staying'];
  members: IMemberWithActivate[];
}

// me

interface ModifiedClinicMemberWithClinic
  extends Pick<Member, 'id' | 'staying' | 'manager' | 'accepted'> {
  clinic: Pick<Clinic, 'id' | 'name' | 'isActivated'>;
}
interface ModifiedNotice extends Pick<Notice, 'message' | 'read'> {}
export interface ModifiedLoginUser
  extends Pick<User, 'id' | 'name' | 'email' | 'role' | 'verified'> {
  members?: ModifiedClinicMemberWithClinic[] | null;
  notice?: ModifiedNotice[] | null;
}

//

export interface DeactivateClinicInfo {
  id: number;
  name: string;
}

// statistics

type IDailyReports = GetStatisticsQuery['getStatistics']['dailyReports'];
export type IDailyReport = NonNullable<FlatArray<IDailyReports, 0>>;
export type IUserInDaily = IDailyReport['users'][0];

type IDailyPrescriptions = GetStatisticsQuery['getStatistics']['prescriptions'];
export type IDailyPrescription = NonNullable<FlatArray<IDailyPrescriptions, 0>>;
export interface IDailyPrescriptionWithCount extends IDailyPrescription {
  count: number;
}
export type IPrescriptionOfUser = IDailyReport['users'][0]['prescriptions'][0];

export type CountLists = {
  reservationCount: number;
  newPatient: number;
  noshow: number;
  cancel: number;
  visitMoreThanThirty: number;
};

export interface IUserStatistics {
  name: string;
  counts: CountLists;
  prescriptions: IDailyPrescriptionWithCount[];
}

export interface MemberState {
  userId: number;
  name: string;
  isSelected: boolean;
}

///

export interface ISelectedPrescription {
  price: number;
  minute: number;
  prescriptions: number[];
}

export interface IReserveForm {
  // startDateYear: number;
  // startDateMonth: number;
  // startDateDate: number;
  // startDateHours: number;
  // startDateMinutes: number;
  // endDateYear?: number;
  // endDateMonth?: number;
  // endDateDate?: number;
  // endDateHours?: number;
  // endDateMinutes?: number;
  memo?: string;
  userId?: number;
  description?: string;
}

//

export interface IUserWithEvent extends IMember {
  events: IListReservation[];
  isActivate?: boolean;
}
export interface DayWithUsers {
  date: Date;
  users: IUserWithEvent[];
}

export interface SelectedInfo {
  clinic: ISelectedClinic | null;
  patient: SelectedPatient | null;
  reservation: IListReservation | null;
}

export type SetSelectedInfoKey = keyof SelectedInfo;
export type SetSelectedInfoValue = SelectedInfo[SetSelectedInfoKey];

// utils

interface UserIdAndName {
  userId: number;
  userName: string;
}

export interface CreateLocalStorageKey extends Partial<UserIdAndName> {
  key: LocalStorageValue;
}
export interface GetLocalStorage extends UserIdAndName {
  key: LocalStorageKey;
}
export interface SetLocalStorage extends GetLocalStorage {
  value: any;
}

export interface GetTokenLocalStorage extends Partial<UserIdAndName> {
  key: 'token';
}
export interface SetTokenLocalStorage
  extends Pick<SetLocalStorage, 'value'>,
    Partial<UserIdAndName> {
  key: 'token';
}
export interface RemoveTokenLocalStorage extends Partial<UserIdAndName> {
  key: 'token';
}

export type LoggedInUser = MeQuery['me'] | undefined | null;

export interface ToastState {
  message?: string;
  fade?: boolean;
  milliseconds?: number;
}
