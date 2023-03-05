import type {
  CreateReservationInput,
  EditReservationInput,
  FindMyClinicsQuery,
  FindMyMembersQuery,
  FindPrescriptionsQuery,
  GetClinicQuery,
  GetMemberQuery,
  GetReservationsByPatientQuery,
  GetStatisticsQuery,
  GetReservationsByIntervalQuery,
  Member,
  SearchPatientQuery,
} from './generatedTypes';

// clinic

export type ClinicsOfFindMyClinics =
  FindMyClinicsQuery['findMyClinics']['clinics'];

export type MyClinic = NonNullable<FlatArray<ClinicsOfFindMyClinics, 0>>;

export type ClinicOfGetMyClinic = GetClinicQuery['getClinic']['clinic'];
export type ClinicOfGetMyClinicTruth = NonNullable<
  GetClinicQuery['getClinic']['clinic']
>;

export type ClinicInReservation = NonNullable<
  ReservationOfGetReservationsByInterval['clinic']
>;

// patient

export type PatientInReservation = NonNullable<
  ReservationOfGetReservationsByInterval['patient']
>;

export type PatientsInSearch = SearchPatientQuery['searchPatient']['patients'];

export type PatientInSearch = NonNullable<PatientsInSearch>[0];

// prescriptions

export type ResultOfFindPrescriptions =
  FindPrescriptionsQuery['findPrescriptions'];

export type PrescriptionForFind = NonNullable<
  FlatArray<ResultOfFindPrescriptions['prescriptions'], 1>
>;

export type PrescriptionsInReservation = NonNullable<
  ReservationOfGetReservationsByInterval['prescriptions']
>;

// members

export type MemberOfGetMember = NonNullable<
  GetMemberQuery['getMember']['member']
>;

export type MemberOfGetMyClinic = ClinicOfGetMyClinicTruth['members'][0];

// TODO : MyClinicMember로 이름 변경
export type IMember = MyClinic['members'][0];

export type MyMembersType = FindMyMembersQuery['findMyMembers']['members'];

export interface MemberStatusOptions
  extends Pick<Member, 'staying' | 'manager' | 'accepted'> {}

// reservations
export type ResultOfGetReservationsByInterval =
  | GetReservationsByIntervalQuery['getReservationsByInterval']
  | null
  | undefined;

export type ReservationOfGetReservationsByInterval = NonNullable<
  GetReservationsByIntervalQuery['getReservationsByInterval']['results']
>[0];

export type ReservationInPatient = NonNullable<
  GetReservationsByPatientQuery['getReservationsByPatient']['results']
>[0];

// dayoff

type DayoffInput = Pick<
  CreateReservationInput,
  'startDate' | 'endDate' | 'memo' | 'userId'
>;
export interface CreateDayoffInput
  extends DayoffInput,
    Pick<CreateReservationInput, 'clinicId'> {}
export interface EditDayoffInput
  extends DayoffInput,
    Pick<EditReservationInput, 'reservationId'> {}

// Users

export type UserInReservation = ReservationOfGetReservationsByInterval['user'];

// statistics

export type DailyReportsOfGetStatistics =
  GetStatisticsQuery['getStatistics']['dailyReports'];
