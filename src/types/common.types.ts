import { SVGProps } from 'react';
import {
  Clinic,
  FindMyClinicsQuery,
  FindMyMembersQuery,
  GetClinicQuery,
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
}

// typescript type & interface
export type ClinicsOfFindMyClinics =
  FindMyClinicsQuery['findMyClinics']['clinics'];
export type MyClinic = NonNullable<FlatArray<ClinicsOfFindMyClinics, 0>>;

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
  isAccepted: boolean;
  position: ClinicPosition;
}
export interface ClinicOfClient
  extends Omit<MyClinic, 'members'>,
    ClinicOfClientState {
  members: MemberOfClient[];
}

export type MyMembersType = FindMyMembersQuery['findMyMembers']['members'];
export interface MyMembers {
  관리자: MyMembersType;
  직원: MyMembersType;
  탈퇴: MyMembersType;
  승인대기: MyMembersType;
  폐쇄: MyMembersType;
}

export type ResultOfListReservations =
  | ListReservationsQuery['listReservations']
  | null
  | undefined;

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

// clinic
export type ClinicOfGetMyClinic = GetClinicQuery['getClinic']['clinic'];
export type ClinicOfGetMyClinicTruth = NonNullable<
  GetClinicQuery['getClinic']['clinic']
>;
export type MemberOfGetMyClinic = ClinicOfGetMyClinicTruth['members'];

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

export interface DashboardOutletContext {
  outletWidth: number;
}

export interface SettingOutletContext extends DashboardOutletContext {}
