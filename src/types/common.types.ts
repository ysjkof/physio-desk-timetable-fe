import { SVGProps } from 'react';
import {
  Clinic,
  FindMyClinicsQuery,
  GetReservationsByPatientQuery,
  GetStatisticsQuery,
  ListReservationsQuery,
  Member,
  MeQuery,
  Notice,
  Prescription,
  SearchPatientQuery,
  User,
} from './generated.types';

// models

export interface TimeLabelArg {
  readonly label: string;
  readonly visibleMinute: string[];
  readonly colors: string[];
}

export interface FirstAndLastTime {
  firstHour: number;
  firstMinute: number;
  lastHour: number;
  lastMinute: number;
}

export interface HoursAndMinutes {
  hours?: number;
  minutes?: number;
}

export interface TableTimeOptions extends FirstAndLastTime {
  gap: number;
}

export interface TableDisplayOptions {
  hasWeekView: boolean;
  seeCancel: boolean;
  seeNoshow: boolean;
  seeList: boolean;
  seeCalendar: boolean;
  asideExtension: boolean;
}

// typescript type & interface
export type IFindMyClinics = FindMyClinicsQuery['findMyClinics']['clinics'];
export type MyClinic = NonNullable<FlatArray<IFindMyClinics, 0>>;

// TODO : MyClinicMember로 이름 변경
export type IMember = MyClinic['members'][0];

export interface MemberOfClient extends IMember {
  canSee?: boolean;
}

type ClinicPosition = '관리자' | '직원';

export interface ClinicOfClientState {
  isSelected: boolean;
  isManager: boolean;
  isStayed: boolean;
  position: ClinicPosition;
}
export interface ClinicOfClient
  extends Omit<MyClinic, 'members'>,
    ClinicOfClientState {
  members: MemberOfClient[];
}

export type ReservationInList = NonNullable<
  ListReservationsQuery['listReservations']['results']
>[0];

export type PatientInReservation = NonNullable<ReservationInList['patient']>;
export type ClinicInReservation = NonNullable<ReservationInList['clinic']>;
export type UserInReservation = ReservationInList['user'];
export type PrescriptionsInReservation = NonNullable<
  ReservationInList['prescriptions']
>;

export type ReservationInPatient = NonNullable<
  GetReservationsByPatientQuery['getReservationsByPatient']['results']
>[0];

export interface PrescriptionWithSelect extends Prescription {
  isSelect: boolean;
}

export interface IsActive {
  isActive: boolean;
}

export type PatientInSearch = NonNullable<
  SearchPatientQuery['searchPatient']['patients']
>[0];

// me
export interface MemberStatus
  extends Pick<Member, 'staying' | 'manager' | 'accepted'> {}
interface ModifiedClinicMemberWithClinic
  extends Pick<Member, 'id'>,
    MemberStatus {
  clinic: Pick<Clinic, 'id' | 'name' | 'isActivated'>;
}
type ModifiedNotice = Pick<Notice, 'message' | 'read'>;
export interface ModifiedLoginUser
  extends Pick<User, 'id' | 'name' | 'email' | 'role' | 'verified'> {
  members?: ModifiedClinicMemberWithClinic[] | null;
  notice?: ModifiedNotice[] | null;
}

//

export interface IdAndName {
  id: number;
  name: string;
}
export interface UserIdAndName {
  userId: number;
  userName: string;
}

export interface Value {
  value: unknown;
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

export interface SelectedPrescription {
  price: number;
  minute: number;
  prescriptions: number[];
}

export interface ReserveFormType {
  userId: number;
  memo?: string;
  description?: string;
}

//

export interface UserWithEvent extends MemberOfClient {
  events: ReservationInList[];
}
export interface ISchedules {
  date: Date;
  users: UserWithEvent[];
}

export type SelectedReservationType = ReservationInList | undefined;

export type SelectedPatientType = SelectedPatient | undefined | null;
export interface SelectedPatient extends PatientInReservation {
  clinic: ClinicInReservation;
  user: UserInReservation | null | undefined;
}

// utils

export type LoggedInUser = MeQuery['me'] | undefined | null;

export interface ToastState {
  messages?: string[];
  fade?: boolean;
  milliseconds?: number;
  bgColor?: boolean;
}

export interface SVG extends SVGProps<SVGSVGElement> {
  iconSize?: 'LG' | 'MD' | 'SM';
}

export interface ClassNameProps {
  className?: string;
}

//

export interface ObjValueIsFx {
  [key: string]: () => void;
}

export interface LocationState {
  createReservation?: boolean;
  startDate: {
    hours: number;
    minutes: number;
    dayIndex: number;
  };
  userId: number;
  isDayoff?: boolean;
  createPatient?: boolean;
}
