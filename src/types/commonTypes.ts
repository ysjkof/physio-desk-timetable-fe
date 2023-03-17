import type { SVGProps } from 'react';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import type { Prescription } from './generatedTypes';
import type {
  ClinicInReservation,
  MemberOfGetMyClinic,
  MemberOfGetReservationsByInterval,
  MyMembersType,
  PatientInReservation,
  ReservationOfGetReservationsByInterval,
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

export interface MemberOfClient extends MemberOfGetMyClinic {}

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
export interface CountListOfEachUser {
  [key: string]: PrimaryCountListItem;
}

export interface CountListWithDate extends PrimaryCountListItem {
  date: Date;
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

export interface MemberWithEvent extends MemberOfGetReservationsByInterval {
  events: ReservationOfGetReservationsByInterval[];
}
export interface ISchedules {
  date: Date;
  members: MemberWithEvent[];
}

export interface PickedPatient extends PatientInReservation {
  clinic: ClinicInReservation;
  user: UserInReservation | null | undefined;
}

export type PickedReservationType =
  | ReservationOfGetReservationsByInterval
  | undefined;

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
export type ObjValueIsNumber = Record<string, number>;

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

export type ApolloClientType = ApolloClient<NormalizedCacheObject> | null;

export interface GraphData {
  x: any;
  y: {
    cancel: number;
    newPatient: number;
    noshow: number;
    reservationCount: number;
  };
}

export type Gender = 'male' | 'female';
