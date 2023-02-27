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
  ListReservationsQuery,
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

export type ClinicInReservation = NonNullable<ReservationInList['clinic']>;

// patient

export type PatientInReservation = NonNullable<ReservationInList['patient']>;

export type PatientsInSearch = SearchPatientQuery['searchPatient']['patients'];

export type PatientInSearch = NonNullable<PatientsInSearch>[0];

// prescriptions

export type ResultOfFindPrescriptions =
  FindPrescriptionsQuery['findPrescriptions'];

export type PrescriptionForFind = NonNullable<
  FlatArray<ResultOfFindPrescriptions['prescriptions'], 1>
>;

export type PrescriptionsInReservation = NonNullable<
  ReservationInList['prescriptions']
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
export type ResultOfListReservations =
  | ListReservationsQuery['listReservations']
  | null
  | undefined;

export type ReservationInList = NonNullable<
  ListReservationsQuery['listReservations']['results']
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

export type UserInReservation = ReservationInList['user'];

// statistics

type PrescriptionsOfGetStatistics =
  GetStatisticsQuery['getStatistics']['prescriptions'];

export type PrescriptionOfGetStatistics = NonNullable<
  FlatArray<PrescriptionsOfGetStatistics, 0>
>;

export type DailyReportsOfGetStatistics =
  GetStatisticsQuery['getStatistics']['dailyReports'];

export type DailyReportOfGetStatistics = NonNullable<
  FlatArray<DailyReportsOfGetStatistics, 0>
>;

export type UsersOfGetStatistics = DailyReportOfGetStatistics['users'][0];
