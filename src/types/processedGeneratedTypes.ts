import type {
  CreateReservationInput,
  UpdateReservationInput,
  GetMyMembersQuery,
  GetClinicQuery,
  GetMemberQuery,
  GetReservationsByPatientQuery,
  GetStatisticsQuery,
  GetReservationsByIntervalQuery,
  Member,
  GetPatientByQuery,
  GetPrescriptionsByClinicQuery,
  UpdatePrescriptionInput,
} from './generatedTypes';

// clinic

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

export type PatientsInSearch = GetPatientByQuery['getPatientBy']['patients'];

export type PatientInSearch = NonNullable<PatientsInSearch>[0];

// prescriptions

export type ResultOfFindPrescriptions =
  GetPrescriptionsByClinicQuery['getPrescriptionsByClinic'];

export type PrescriptionForFind = NonNullable<
  FlatArray<ResultOfFindPrescriptions['prescriptions'], 1>
>;

export type PrescriptionsInReservation = NonNullable<
  ReservationOfGetReservationsByInterval['prescriptions']
>;

export type UpdatePrescriptionVariables = Omit<UpdatePrescriptionInput, 'id'>;

// members

export type MemberOfGetMember = NonNullable<
  GetMemberQuery['getMember']['member']
>;

export type MembersOfGetMyClinic = ClinicOfGetMyClinicTruth['members'];

export type MemberOfGetMyClinic = ClinicOfGetMyClinicTruth['members'][0];

export type MyMembersType = GetMyMembersQuery['getMyMembers']['members'];

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
export interface UpdateDayoffInput
  extends DayoffInput,
    Pick<UpdateReservationInput, 'reservationId'> {}

// Users

export type UserInReservation = ReservationOfGetReservationsByInterval['user'];

// statistics

export type DailyReportsOfGetStatistics =
  GetStatisticsQuery['getStatistics']['dailyReports'];
