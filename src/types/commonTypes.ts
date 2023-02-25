import type { SVGProps } from 'react';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import type { Prescription } from './generatedTypes';
import type {
  ClinicInReservation,
  PrescriptionOfGetStatistics,
  DailyReportOfGetStatistics,
  IMember,
  MemberOfGetMyClinic,
  MyClinic,
  MyMembersType,
  PatientInReservation,
  ReservationInList,
  UserInReservation,
} from './processedGeneratedTypes';

// models

export interface TimeLabelArg {
  readonly label: string;
  readonly visibleMinute: string[];
  readonly colors: string[];
}

export interface HoursAndMinutes {
  hours?: number;
  minutes?: number;
}

export interface FirstAndLastTime {
  firstHour: number;
  firstMinute: number;
  lastHour: number;
  lastMinute: number;
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

export interface ClinicOfClient
  extends Omit<MyClinic, 'members'>,
    ClinicOfClientState {
  members: MemberOfClient[];
}
export interface MemberOfClient extends MemberOfGetMyClinic {
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
export interface MyMembers {
  관리자: MyMembersType;
  직원: MyMembersType;
  탈퇴: MyMembersType;
  수락대기: MyMembersType;
  폐쇄: MyMembersType;
}

export interface PrescriptionWithSelect extends Prescription {
  isSelect: boolean;
}

export interface IsActive {
  isActive: boolean;
}

// me

export type MemberStatusType = '관리자' | '직원' | '탈퇴' | '수락대기';

// clinic

export interface IdAndName {
  id: number;
  name: string;
}

export interface UserIdAndName extends IdAndName {}

export interface Value {
  value: unknown;
}
export interface IDailyPrescriptionWithCount
  extends PrescriptionOfGetStatistics {
  count: number;
}
export type IPrescriptionOfUser =
  DailyReportOfGetStatistics['users'][0]['prescriptions'][0];

export interface PrimaryCountList {
  [key: string]: PrimaryCountListItem;
}
export interface PrimaryCountListItem {
  reservationCount: number;
  newPatient: number;
  noshow: number;
  cancel: number;
}
export interface CountLists extends PrimaryCountListItem {
  visitMoreThanThirty: number;
}

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

export interface PickedPrescription {
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

export interface MemberWithEvent extends MemberOfClient {
  events: ReservationInList[];
}
export interface ISchedules {
  date: Date;
  members: MemberWithEvent[];
}

export interface PickedPatient extends PatientInReservation {
  clinic: ClinicInReservation;
  user: UserInReservation | null | undefined;
}

export type PickedReservationType = ReservationInList | undefined;

export type PickedPatientType = PickedPatient | undefined | null;

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

export interface SettingOutletContext {
  outletWidth: number;
}

export type ApolloClientType = ApolloClient<NormalizedCacheObject> | null;
