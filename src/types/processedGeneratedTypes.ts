import type {
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

export type MemberOfGetMyClinic = ClinicOfGetMyClinicTruth['members'];

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

// Users

export type UserInReservation = ReservationInList['user'];

// statistics

type IDailyPrescriptions = GetStatisticsQuery['getStatistics']['prescriptions'];

export type IDailyPrescription = NonNullable<FlatArray<IDailyPrescriptions, 0>>;

type IDailyReports = GetStatisticsQuery['getStatistics']['dailyReports'];

export type IDailyReport = NonNullable<FlatArray<IDailyReports, 0>>;

export type IUserInDaily = IDailyReport['users'][0];
