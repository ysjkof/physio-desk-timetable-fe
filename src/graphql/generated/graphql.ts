import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type AcceptInvitationInput = {
  clinicId: Scalars['Int'];
};

export type AcceptInvitationOutput = {
  __typename?: 'AcceptInvitationOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type Clinic = {
  __typename?: 'Clinic';
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['Float'];
  isActivated: Scalars['Boolean'];
  members: Array<Member>;
  name: Scalars['String'];
  patient?: Maybe<Array<Patient>>;
  prescriptions: Array<Prescription>;
  reservations?: Maybe<Array<Reservation>>;
  type: ClinicType;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export enum ClinicType {
  Group = 'Group',
  Personal = 'Personal'
}

export type CreateAccountInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};

export type CreateAccountOutput = {
  __typename?: 'CreateAccountOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type CreateAtomPrescriptionInput = {
  name: Scalars['String'];
};

export type CreateAtomPrescriptionOutput = {
  __typename?: 'CreateAtomPrescriptionOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type CreateClinicInput = {
  isPersonal?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
};

export type CreateClinicOutput = {
  __typename?: 'CreateClinicOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type CreateDayOffInput = {
  clinicId: Scalars['Float'];
  endDate: Scalars['DateTime'];
  memo?: InputMaybe<Scalars['String']>;
  startDate: Scalars['DateTime'];
  userId: Scalars['Float'];
};

export type CreateDayOffOutput = {
  __typename?: 'CreateDayOffOutput';
  dayOff?: Maybe<Reservation>;
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type CreatePatientInput = {
  birthday?: InputMaybe<Scalars['DateTime']>;
  clinicId?: InputMaybe<Scalars['Int']>;
  gender?: InputMaybe<Scalars['String']>;
  memo?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type CreatePatientOutput = {
  __typename?: 'CreatePatientOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  patient?: Maybe<Patient>;
};

export type CreatePrescriptionInput = {
  clinicId: Scalars['Int'];
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  prescriptionAtomIds: Array<Scalars['Int']>;
  price: Scalars['Int'];
  requiredTime: Scalars['Int'];
};

export type CreatePrescriptionOutput = {
  __typename?: 'CreatePrescriptionOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type CreateReservationInput = {
  clinicId: Scalars['Float'];
  endDate: Scalars['DateTime'];
  isDayoff?: InputMaybe<Scalars['Boolean']>;
  memo?: InputMaybe<Scalars['String']>;
  patientId?: InputMaybe<Scalars['Float']>;
  prescriptionIds?: InputMaybe<Array<Scalars['Float']>>;
  startDate: Scalars['DateTime'];
  userId: Scalars['Float'];
};

export type CreateReservationOutput = {
  __typename?: 'CreateReservationOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  reservation?: Maybe<Reservation>;
};

export type DailyReport = {
  __typename?: 'DailyReport';
  cancel: Scalars['Int'];
  date: Scalars['DateTime'];
  newPatient: Scalars['Int'];
  noshow: Scalars['Int'];
  reservationCount: Scalars['Int'];
  users: Array<UserInDailyReport>;
};

export type DeletePatientInput = {
  patientId: Scalars['Float'];
};

export type DeletePatientOutput = {
  __typename?: 'DeletePatientOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type DeleteReservationInput = {
  reservationId: Scalars['Int'];
};

export type DeleteReservationOutput = {
  __typename?: 'DeleteReservationOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type EditPatientInput = {
  birthday?: InputMaybe<Scalars['DateTime']>;
  clinicId?: InputMaybe<Scalars['Int']>;
  gender?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  memo?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type EditPatientOutput = {
  __typename?: 'EditPatientOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type EditProfileInput = {
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
};

export type EditProfileOutput = {
  __typename?: 'EditProfileOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type EditReservationInput = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  memo?: InputMaybe<Scalars['String']>;
  prescriptionIds?: InputMaybe<Array<Scalars['Float']>>;
  reservationId: Scalars['Int'];
  startDate?: InputMaybe<Scalars['DateTime']>;
  state?: InputMaybe<ReservationState>;
  userId?: InputMaybe<Scalars['Int']>;
};

export type EditReservationOutput = {
  __typename?: 'EditReservationOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type FindAllPatientsInput = {
  clinicId: Scalars['Int'];
  page?: InputMaybe<Scalars['Int']>;
};

export type FindAllPatientsOutput = {
  __typename?: 'FindAllPatientsOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  results?: Maybe<Array<Patient>>;
  totalCount?: Maybe<Scalars['Int']>;
  totalPages?: Maybe<Scalars['Int']>;
};

export type FindAtomPrescriptionsOutput = {
  __typename?: 'FindAtomPrescriptionsOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  results?: Maybe<Array<PrescriptionAtom>>;
};

export type FindMyClinicsInput = {
  includeInactivate?: InputMaybe<Scalars['Boolean']>;
};

export type FindMyClinicsOutput = {
  __typename?: 'FindMyClinicsOutput';
  clinics?: Maybe<Array<Clinic>>;
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type FindPrescriptionsInput = {
  clinicId: Scalars['Int'];
  onlyLookUpActive?: InputMaybe<Scalars['Boolean']>;
};

export type FindPrescriptionsOutput = {
  __typename?: 'FindPrescriptionsOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  prescriptions?: Maybe<Array<Prescription>>;
};

export type GetClinicInput = {
  clinicId: Scalars['Int'];
};

export type GetClinicOutput = {
  __typename?: 'GetClinicOutput';
  clinic?: Maybe<Clinic>;
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type GetPatientsInput = {
  onlyId?: InputMaybe<Scalars['Boolean']>;
  patientIds: Array<Scalars['Int']>;
};

export type GetPatientsOutput = {
  __typename?: 'GetPatientsOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  patients: Array<Patient>;
};

export type GetPrescriptionsInput = {
  clinicId: Scalars['Int'];
  onlyLookUpActive?: InputMaybe<Scalars['Boolean']>;
  prescriptionIds: Array<Scalars['Int']>;
};

export type GetPrescriptionsOutput = {
  __typename?: 'GetPrescriptionsOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  prescriptions?: Maybe<Array<Prescription>>;
};

export type GetReservationInput = {
  reservationId: Scalars['Int'];
};

export type GetReservationOutput = {
  __typename?: 'GetReservationOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  reservation?: Maybe<Reservation>;
};

export type GetReservationsByPatientInput = {
  page?: InputMaybe<Scalars['Int']>;
  patientId?: InputMaybe<Scalars['Int']>;
};

export type GetReservationsByPatientOutput = {
  __typename?: 'GetReservationsByPatientOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  results?: Maybe<Array<Reservation>>;
  totalCount?: Maybe<Scalars['Int']>;
  totalPages?: Maybe<Scalars['Int']>;
};

export type GetStatisticsInput = {
  clinicId?: InputMaybe<Scalars['Int']>;
  endDate: Scalars['DateTime'];
  prescIds?: InputMaybe<Array<Scalars['Int']>>;
  startDate: Scalars['DateTime'];
  userIds?: InputMaybe<Array<Scalars['Int']>>;
};

export type GetStatisticsOutput = {
  __typename?: 'GetStatisticsOutput';
  dailyReports?: Maybe<Array<DailyReport>>;
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  prescriptions?: Maybe<Array<Prescription>>;
  visitRates?: Maybe<Array<VisitRate>>;
};

export type GetUserOutput = {
  __typename?: 'GetUserOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  user?: Maybe<User>;
};

export type InactivateClinicInput = {
  clinicId: Scalars['Int'];
};

export type InactivateClinicOutput = {
  __typename?: 'InactivateClinicOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type InviteClinicInput = {
  clinicId: Scalars['Int'];
  userIds: Array<Scalars['Int']>;
};

export type InviteClinicOutput = {
  __typename?: 'InviteClinicOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type LeaveClinicInput = {
  clinicId: Scalars['Int'];
};

export type LeaveClinicOutput = {
  __typename?: 'LeaveClinicOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type ListReservationsInput = {
  clinicId: Scalars['Int'];
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
  userIds: Array<Scalars['Int']>;
};

export type ListReservationsOutput = {
  __typename?: 'ListReservationsOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  results?: Maybe<Array<Reservation>>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type LoginOutput = {
  __typename?: 'LoginOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  token?: Maybe<Scalars['String']>;
};

export type Member = {
  __typename?: 'Member';
  accepted: Scalars['Boolean'];
  clinic: Clinic;
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['Float'];
  manager: Scalars['Boolean'];
  staying: Scalars['Boolean'];
  updatedAt?: Maybe<Scalars['DateTime']>;
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvitation: AcceptInvitationOutput;
  createAccount: CreateAccountOutput;
  createAtomPrescription: CreateAtomPrescriptionOutput;
  createClinic: CreateClinicOutput;
  createDayOff: CreateDayOffOutput;
  createPatient: CreatePatientOutput;
  createPrescription: CreatePrescriptionOutput;
  createReservation: CreateReservationOutput;
  deletePatient: DeletePatientOutput;
  deleteReservation: DeleteReservationOutput;
  editPatient: EditPatientOutput;
  editProfile: EditProfileOutput;
  editReservation: EditReservationOutput;
  inactivateClinic: InactivateClinicOutput;
  inviteClinic: InviteClinicOutput;
  leaveClinic: LeaveClinicOutput;
  login: LoginOutput;
  verifyEmail: VerifyEmailOutput;
};


export type MutationAcceptInvitationArgs = {
  input: AcceptInvitationInput;
};


export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


export type MutationCreateAtomPrescriptionArgs = {
  input: CreateAtomPrescriptionInput;
};


export type MutationCreateClinicArgs = {
  input: CreateClinicInput;
};


export type MutationCreateDayOffArgs = {
  input: CreateDayOffInput;
};


export type MutationCreatePatientArgs = {
  input: CreatePatientInput;
};


export type MutationCreatePrescriptionArgs = {
  input: CreatePrescriptionInput;
};


export type MutationCreateReservationArgs = {
  input: CreateReservationInput;
};


export type MutationDeletePatientArgs = {
  input: DeletePatientInput;
};


export type MutationDeleteReservationArgs = {
  input: DeleteReservationInput;
};


export type MutationEditPatientArgs = {
  input: EditPatientInput;
};


export type MutationEditProfileArgs = {
  input: EditProfileInput;
};


export type MutationEditReservationArgs = {
  input: EditReservationInput;
};


export type MutationInactivateClinicArgs = {
  input: InactivateClinicInput;
};


export type MutationInviteClinicArgs = {
  input: InviteClinicInput;
};


export type MutationLeaveClinicArgs = {
  input: LeaveClinicInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationVerifyEmailArgs = {
  input: VerifyEmailInput;
};

export type Notice = {
  __typename?: 'Notice';
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['Float'];
  message: Scalars['String'];
  read: Scalars['Boolean'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type Patient = {
  __typename?: 'Patient';
  birthday?: Maybe<Scalars['DateTime']>;
  clinic?: Maybe<Clinic>;
  createdAt?: Maybe<Scalars['DateTime']>;
  gender: Scalars['String'];
  id: Scalars['Float'];
  isNew?: Maybe<Scalars['Boolean']>;
  memo?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  registrationNumber: Scalars['Int'];
  reservations: Array<Reservation>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  users: Array<User>;
};

export type Prescription = {
  __typename?: 'Prescription';
  activate?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['Float'];
  name: Scalars['String'];
  prescriptionAtoms?: Maybe<Array<PrescriptionAtom>>;
  price: Scalars['Int'];
  requiredTime: Scalars['Int'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type PrescriptionAtom = {
  __typename?: 'PrescriptionAtom';
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['Float'];
  name: Scalars['String'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type Query = {
  __typename?: 'Query';
  findAllPatients: FindAllPatientsOutput;
  findAtomPrescriptions: FindAtomPrescriptionsOutput;
  findMyClinics: FindMyClinicsOutput;
  findPrescriptions: FindPrescriptionsOutput;
  getClinic: GetClinicOutput;
  getPatients: GetPatientsOutput;
  getPrescriptions: GetPrescriptionsOutput;
  getReservation: GetReservationOutput;
  getReservationsByPatient: GetReservationsByPatientOutput;
  getStatistics: GetStatisticsOutput;
  listReservations: ListReservationsOutput;
  me: User;
  searchPatient: SearchPatientOutput;
  searchUsers: SearchUsersOutput;
  userProfile: GetUserOutput;
};


export type QueryFindAllPatientsArgs = {
  input: FindAllPatientsInput;
};


export type QueryFindMyClinicsArgs = {
  input: FindMyClinicsInput;
};


export type QueryFindPrescriptionsArgs = {
  input: FindPrescriptionsInput;
};


export type QueryGetClinicArgs = {
  input: GetClinicInput;
};


export type QueryGetPatientsArgs = {
  input: GetPatientsInput;
};


export type QueryGetPrescriptionsArgs = {
  input: GetPrescriptionsInput;
};


export type QueryGetReservationArgs = {
  input: GetReservationInput;
};


export type QueryGetReservationsByPatientArgs = {
  input: GetReservationsByPatientInput;
};


export type QueryGetStatisticsArgs = {
  input: GetStatisticsInput;
};


export type QueryListReservationsArgs = {
  input: ListReservationsInput;
};


export type QuerySearchPatientArgs = {
  input: SearchPatientInput;
};


export type QuerySearchUsersArgs = {
  input: SearchUsersInput;
};


export type QueryUserProfileArgs = {
  id: Scalars['Float'];
};

export type Reservation = {
  __typename?: 'Reservation';
  clinic: Clinic;
  createdAt?: Maybe<Scalars['DateTime']>;
  endDate: Scalars['DateTime'];
  id: Scalars['Float'];
  isFirst: Scalars['Boolean'];
  lastModifier: User;
  memo?: Maybe<Scalars['String']>;
  patient?: Maybe<Patient>;
  prescriptions?: Maybe<Array<Prescription>>;
  startDate: Scalars['DateTime'];
  state: ReservationState;
  updatedAt?: Maybe<Scalars['DateTime']>;
  user: User;
};

export enum ReservationState {
  Canceled = 'Canceled',
  DayOff = 'DayOff',
  NoShow = 'NoShow',
  Reserved = 'Reserved'
}

export type SearchPatientInput = {
  clinicId?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  query: Scalars['String'];
};

export type SearchPatientOutput = {
  __typename?: 'SearchPatientOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  patients?: Maybe<Array<Patient>>;
  totalCount?: Maybe<Scalars['Int']>;
  totalPages?: Maybe<Scalars['Int']>;
};

export type SearchUsersInput = {
  name: Scalars['String'];
};

export type SearchUsersOutput = {
  __typename?: 'SearchUsersOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  results?: Maybe<Array<User>>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type User = {
  __typename?: 'User';
  createdAt?: Maybe<Scalars['DateTime']>;
  email: Scalars['String'];
  id: Scalars['Float'];
  members?: Maybe<Array<Member>>;
  name: Scalars['String'];
  notice?: Maybe<Array<Notice>>;
  password: Scalars['String'];
  role: UserRole;
  updatedAt?: Maybe<Scalars['DateTime']>;
  verified: Scalars['Boolean'];
};

export type UserInDailyReport = {
  __typename?: 'UserInDailyReport';
  cancel: Scalars['Int'];
  newPatient: Scalars['Int'];
  noshow: Scalars['Int'];
  prescriptions: Array<GetStatisticsOutputPrescription>;
  reservationCount: Scalars['Int'];
  reservations: Array<Reservation>;
  userId: Scalars['Int'];
  visitMoreThanNinety: Scalars['Int'];
  visitMoreThanSixty: Scalars['Int'];
  visitMoreThanThirty: Scalars['Int'];
};

export enum UserRole {
  Client = 'Client',
  Customer = 'Customer',
  Therapist = 'Therapist',
  TopAdmin = 'TopAdmin'
}

export type VerifyEmailInput = {
  code: Scalars['String'];
};

export type VerifyEmailOutput = {
  __typename?: 'VerifyEmailOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type VisitRate = {
  __typename?: 'VisitRate';
  patientId: Scalars['Int'];
  visited: Array<Scalars['Boolean']>;
};

export type GetStatisticsOutputPrescription = {
  __typename?: 'getStatisticsOutputPrescription';
  count: Scalars['Int'];
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type AcceptInvitationMutationVariables = Exact<{
  input: AcceptInvitationInput;
}>;


export type AcceptInvitationMutation = { __typename?: 'Mutation', acceptInvitation: { __typename?: 'AcceptInvitationOutput', ok: boolean, error?: string | null } };

export type InactivateClinicMutationVariables = Exact<{
  input: InactivateClinicInput;
}>;


export type InactivateClinicMutation = { __typename?: 'Mutation', inactivateClinic: { __typename?: 'InactivateClinicOutput', ok: boolean, error?: string | null } };

export type CreateAccountMutationVariables = Exact<{
  input: CreateAccountInput;
}>;


export type CreateAccountMutation = { __typename?: 'Mutation', createAccount: { __typename?: 'CreateAccountOutput', ok: boolean, error?: string | null } };

export type CreateAtomPrescriptionMutationVariables = Exact<{
  input: CreateAtomPrescriptionInput;
}>;


export type CreateAtomPrescriptionMutation = { __typename?: 'Mutation', createAtomPrescription: { __typename?: 'CreateAtomPrescriptionOutput', ok: boolean, error?: string | null } };

export type CreateDayOffMutationVariables = Exact<{
  input: CreateDayOffInput;
}>;


export type CreateDayOffMutation = { __typename?: 'Mutation', createDayOff: { __typename?: 'CreateDayOffOutput', ok: boolean, error?: string | null } };

export type CreateClinicMutationVariables = Exact<{
  input: CreateClinicInput;
}>;


export type CreateClinicMutation = { __typename?: 'Mutation', createClinic: { __typename?: 'CreateClinicOutput', ok: boolean, error?: string | null } };

export type CreatePatientMutationVariables = Exact<{
  input: CreatePatientInput;
}>;


export type CreatePatientMutation = { __typename?: 'Mutation', createPatient: { __typename?: 'CreatePatientOutput', ok: boolean, error?: string | null, patient?: { __typename?: 'Patient', id: number, name: string, gender: string, registrationNumber: number, birthday?: any | null, memo?: string | null } | null } };

export type CreatePrescriptionMutationVariables = Exact<{
  input: CreatePrescriptionInput;
}>;


export type CreatePrescriptionMutation = { __typename?: 'Mutation', createPrescription: { __typename?: 'CreatePrescriptionOutput', ok: boolean, error?: string | null } };

export type CreateReservationMutationVariables = Exact<{
  input: CreateReservationInput;
}>;


export type CreateReservationMutation = { __typename?: 'Mutation', createReservation: { __typename?: 'CreateReservationOutput', ok: boolean, error?: string | null } };

export type DeleteReservationMutationVariables = Exact<{
  input: DeleteReservationInput;
}>;


export type DeleteReservationMutation = { __typename?: 'Mutation', deleteReservation: { __typename?: 'DeleteReservationOutput', error?: string | null, ok: boolean } };

export type EditPatientMutationVariables = Exact<{
  input: EditPatientInput;
}>;


export type EditPatientMutation = { __typename?: 'Mutation', editPatient: { __typename?: 'EditPatientOutput', error?: string | null, ok: boolean } };

export type EditProfileMutationVariables = Exact<{
  input: EditProfileInput;
}>;


export type EditProfileMutation = { __typename?: 'Mutation', editProfile: { __typename?: 'EditProfileOutput', ok: boolean, error?: string | null } };

export type EditReservationMutationVariables = Exact<{
  input: EditReservationInput;
}>;


export type EditReservationMutation = { __typename?: 'Mutation', editReservation: { __typename?: 'EditReservationOutput', error?: string | null, ok: boolean } };

export type FindAllPatientsQueryVariables = Exact<{
  input: FindAllPatientsInput;
}>;


export type FindAllPatientsQuery = { __typename?: 'Query', findAllPatients: { __typename?: 'FindAllPatientsOutput', ok: boolean, error?: string | null, totalPages?: number | null, totalCount?: number | null, results?: Array<{ __typename?: 'Patient', id: number, name: string, gender: string, registrationNumber: number, birthday?: any | null, clinic?: { __typename?: 'Clinic', name: string } | null }> | null } };

export type FindAtomPrescriptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type FindAtomPrescriptionsQuery = { __typename?: 'Query', findAtomPrescriptions: { __typename?: 'FindAtomPrescriptionsOutput', ok: boolean, error?: string | null, results?: Array<{ __typename?: 'PrescriptionAtom', id: number, name: string }> | null } };

export type FindMyClinicsQueryVariables = Exact<{
  input: FindMyClinicsInput;
}>;


export type FindMyClinicsQuery = { __typename?: 'Query', findMyClinics: { __typename?: 'FindMyClinicsOutput', ok: boolean, error?: string | null, clinics?: Array<{ __typename?: 'Clinic', id: number, name: string, type: ClinicType, isActivated: boolean, members: Array<{ __typename?: 'Member', id: number, staying: boolean, manager: boolean, accepted: boolean, user: { __typename?: 'User', id: number, name: string }, clinic: { __typename?: 'Clinic', id: number, name: string } }> }> | null } };

export type FindPrescriptionsQueryVariables = Exact<{
  input: FindPrescriptionsInput;
}>;


export type FindPrescriptionsQuery = { __typename?: 'Query', findPrescriptions: { __typename?: 'FindPrescriptionsOutput', ok: boolean, error?: string | null, prescriptions?: Array<{ __typename?: 'Prescription', id: number, name: string, requiredTime: number, description?: string | null, price: number, activate?: boolean | null, prescriptionAtoms?: Array<{ __typename?: 'PrescriptionAtom', id: number, name: string }> | null }> | null } };

export type GetClinicQueryVariables = Exact<{
  input: GetClinicInput;
}>;


export type GetClinicQuery = { __typename?: 'Query', getClinic: { __typename?: 'GetClinicOutput', ok: boolean, error?: string | null, clinic?: { __typename?: 'Clinic', id: number, name: string, members: Array<{ __typename?: 'Member', id: number, staying: boolean, manager: boolean, accepted: boolean, user: { __typename?: 'User', id: number, name: string, email: string } }> } | null } };

export type GetPatientsQueryVariables = Exact<{
  input: GetPatientsInput;
}>;


export type GetPatientsQuery = { __typename?: 'Query', getPatients: { __typename?: 'GetPatientsOutput', ok: boolean, error?: string | null, patients: Array<{ __typename?: 'Patient', id: number, name: string, gender: string, registrationNumber: number, birthday?: any | null, memo?: string | null }> } };

export type GetStatisticsQueryVariables = Exact<{
  input: GetStatisticsInput;
}>;


export type GetStatisticsQuery = { __typename?: 'Query', getStatistics: { __typename?: 'GetStatisticsOutput', error?: string | null, ok: boolean, prescriptions?: Array<{ __typename?: 'Prescription', id: number, name: string, price: number, requiredTime: number }> | null, visitRates?: Array<{ __typename?: 'VisitRate', patientId: number, visited: Array<boolean> }> | null, dailyReports?: Array<{ __typename?: 'DailyReport', date: any, reservationCount: number, noshow: number, cancel: number, newPatient: number, users: Array<{ __typename?: 'UserInDailyReport', userId: number, reservationCount: number, noshow: number, cancel: number, newPatient: number, visitMoreThanThirty: number, visitMoreThanSixty: number, visitMoreThanNinety: number, prescriptions: Array<{ __typename?: 'getStatisticsOutputPrescription', id: number, name: string, count: number }>, reservations: Array<{ __typename?: 'Reservation', id: number, startDate: any, endDate: any, state: ReservationState, memo?: string | null, isFirst: boolean, prescriptions?: Array<{ __typename?: 'Prescription', id: number, name: string, price: number, requiredTime: number }> | null, patient?: { __typename?: 'Patient', id: number, name: string } | null, lastModifier: { __typename?: 'User', id: number, name: string } }> }> }> | null } };

export type InviteClinicMutationVariables = Exact<{
  input: InviteClinicInput;
}>;


export type InviteClinicMutation = { __typename?: 'Mutation', inviteClinic: { __typename?: 'InviteClinicOutput', ok: boolean, error?: string | null } };

export type LeaveClinicMutationVariables = Exact<{
  input: LeaveClinicInput;
}>;


export type LeaveClinicMutation = { __typename?: 'Mutation', leaveClinic: { __typename?: 'LeaveClinicOutput', ok: boolean, error?: string | null } };

export type ListReservationsQueryVariables = Exact<{
  input: ListReservationsInput;
}>;


export type ListReservationsQuery = { __typename?: 'Query', listReservations: { __typename?: 'ListReservationsOutput', ok: boolean, totalCount?: number | null, results?: Array<{ __typename?: 'Reservation', id: number, startDate: any, endDate: any, state: ReservationState, memo?: string | null, isFirst: boolean, user: { __typename?: 'User', id: number, name: string }, patient?: { __typename?: 'Patient', id: number, name: string, gender: string, registrationNumber: number, birthday?: any | null, memo?: string | null } | null, lastModifier: { __typename?: 'User', id: number, email: string, name: string, updatedAt?: any | null }, clinic: { __typename?: 'Clinic', id: number, name: string }, prescriptions?: Array<{ __typename?: 'Prescription', id: number, name: string, requiredTime: number, description?: string | null, price: number }> | null }> | null } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginOutput', ok: boolean, token?: string | null, error?: string | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: number, name: string, email: string, role: UserRole, verified: boolean, members?: Array<{ __typename?: 'Member', id: number, staying: boolean, manager: boolean, accepted: boolean, clinic: { __typename?: 'Clinic', id: number, name: string, isActivated: boolean, type: ClinicType } }> | null, notice?: Array<{ __typename?: 'Notice', message: string, read: boolean }> | null } };

export type SearchPatientQueryVariables = Exact<{
  input: SearchPatientInput;
}>;


export type SearchPatientQuery = { __typename?: 'Query', searchPatient: { __typename?: 'SearchPatientOutput', error?: string | null, ok: boolean, totalPages?: number | null, totalCount?: number | null, patients?: Array<{ __typename?: 'Patient', id: number, name: string, gender: string, registrationNumber: number, birthday?: any | null, clinic?: { __typename?: 'Clinic', id: number, name: string } | null, users: Array<{ __typename?: 'User', id: number, name: string }> }> | null } };

export type SearchUsersQueryVariables = Exact<{
  input: SearchUsersInput;
}>;


export type SearchUsersQuery = { __typename?: 'Query', searchUsers: { __typename?: 'SearchUsersOutput', ok: boolean, error?: string | null, totalCount?: number | null, results?: Array<{ __typename?: 'User', id: number, name: string, email: string }> | null } };

export type VerifyEmailMutationVariables = Exact<{
  input: VerifyEmailInput;
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail: { __typename?: 'VerifyEmailOutput', ok: boolean, error?: string | null } };


export const AcceptInvitationDocument = gql`
    mutation acceptInvitation($input: AcceptInvitationInput!) {
  acceptInvitation(input: $input) {
    ok
    error
  }
}
    `;
export type AcceptInvitationMutationFn = Apollo.MutationFunction<AcceptInvitationMutation, AcceptInvitationMutationVariables>;

/**
 * __useAcceptInvitationMutation__
 *
 * To run a mutation, you first call `useAcceptInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptInvitationMutation, { data, loading, error }] = useAcceptInvitationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAcceptInvitationMutation(baseOptions?: Apollo.MutationHookOptions<AcceptInvitationMutation, AcceptInvitationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptInvitationMutation, AcceptInvitationMutationVariables>(AcceptInvitationDocument, options);
      }
export type AcceptInvitationMutationHookResult = ReturnType<typeof useAcceptInvitationMutation>;
export type AcceptInvitationMutationResult = Apollo.MutationResult<AcceptInvitationMutation>;
export type AcceptInvitationMutationOptions = Apollo.BaseMutationOptions<AcceptInvitationMutation, AcceptInvitationMutationVariables>;
export const InactivateClinicDocument = gql`
    mutation inactivateClinic($input: InactivateClinicInput!) {
  inactivateClinic(input: $input) {
    ok
    error
  }
}
    `;
export type InactivateClinicMutationFn = Apollo.MutationFunction<InactivateClinicMutation, InactivateClinicMutationVariables>;

/**
 * __useInactivateClinicMutation__
 *
 * To run a mutation, you first call `useInactivateClinicMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInactivateClinicMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inactivateClinicMutation, { data, loading, error }] = useInactivateClinicMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useInactivateClinicMutation(baseOptions?: Apollo.MutationHookOptions<InactivateClinicMutation, InactivateClinicMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InactivateClinicMutation, InactivateClinicMutationVariables>(InactivateClinicDocument, options);
      }
export type InactivateClinicMutationHookResult = ReturnType<typeof useInactivateClinicMutation>;
export type InactivateClinicMutationResult = Apollo.MutationResult<InactivateClinicMutation>;
export type InactivateClinicMutationOptions = Apollo.BaseMutationOptions<InactivateClinicMutation, InactivateClinicMutationVariables>;
export const CreateAccountDocument = gql`
    mutation createAccount($input: CreateAccountInput!) {
  createAccount(input: $input) {
    ok
    error
  }
}
    `;
export type CreateAccountMutationFn = Apollo.MutationFunction<CreateAccountMutation, CreateAccountMutationVariables>;

/**
 * __useCreateAccountMutation__
 *
 * To run a mutation, you first call `useCreateAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAccountMutation, { data, loading, error }] = useCreateAccountMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAccountMutation(baseOptions?: Apollo.MutationHookOptions<CreateAccountMutation, CreateAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAccountMutation, CreateAccountMutationVariables>(CreateAccountDocument, options);
      }
export type CreateAccountMutationHookResult = ReturnType<typeof useCreateAccountMutation>;
export type CreateAccountMutationResult = Apollo.MutationResult<CreateAccountMutation>;
export type CreateAccountMutationOptions = Apollo.BaseMutationOptions<CreateAccountMutation, CreateAccountMutationVariables>;
export const CreateAtomPrescriptionDocument = gql`
    mutation createAtomPrescription($input: CreateAtomPrescriptionInput!) {
  createAtomPrescription(input: $input) {
    ok
    error
  }
}
    `;
export type CreateAtomPrescriptionMutationFn = Apollo.MutationFunction<CreateAtomPrescriptionMutation, CreateAtomPrescriptionMutationVariables>;

/**
 * __useCreateAtomPrescriptionMutation__
 *
 * To run a mutation, you first call `useCreateAtomPrescriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAtomPrescriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAtomPrescriptionMutation, { data, loading, error }] = useCreateAtomPrescriptionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAtomPrescriptionMutation(baseOptions?: Apollo.MutationHookOptions<CreateAtomPrescriptionMutation, CreateAtomPrescriptionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAtomPrescriptionMutation, CreateAtomPrescriptionMutationVariables>(CreateAtomPrescriptionDocument, options);
      }
export type CreateAtomPrescriptionMutationHookResult = ReturnType<typeof useCreateAtomPrescriptionMutation>;
export type CreateAtomPrescriptionMutationResult = Apollo.MutationResult<CreateAtomPrescriptionMutation>;
export type CreateAtomPrescriptionMutationOptions = Apollo.BaseMutationOptions<CreateAtomPrescriptionMutation, CreateAtomPrescriptionMutationVariables>;
export const CreateDayOffDocument = gql`
    mutation createDayOff($input: CreateDayOffInput!) {
  createDayOff(input: $input) {
    ok
    error
  }
}
    `;
export type CreateDayOffMutationFn = Apollo.MutationFunction<CreateDayOffMutation, CreateDayOffMutationVariables>;

/**
 * __useCreateDayOffMutation__
 *
 * To run a mutation, you first call `useCreateDayOffMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDayOffMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDayOffMutation, { data, loading, error }] = useCreateDayOffMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateDayOffMutation(baseOptions?: Apollo.MutationHookOptions<CreateDayOffMutation, CreateDayOffMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDayOffMutation, CreateDayOffMutationVariables>(CreateDayOffDocument, options);
      }
export type CreateDayOffMutationHookResult = ReturnType<typeof useCreateDayOffMutation>;
export type CreateDayOffMutationResult = Apollo.MutationResult<CreateDayOffMutation>;
export type CreateDayOffMutationOptions = Apollo.BaseMutationOptions<CreateDayOffMutation, CreateDayOffMutationVariables>;
export const CreateClinicDocument = gql`
    mutation createClinic($input: CreateClinicInput!) {
  createClinic(input: $input) {
    ok
    error
  }
}
    `;
export type CreateClinicMutationFn = Apollo.MutationFunction<CreateClinicMutation, CreateClinicMutationVariables>;

/**
 * __useCreateClinicMutation__
 *
 * To run a mutation, you first call `useCreateClinicMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateClinicMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createClinicMutation, { data, loading, error }] = useCreateClinicMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateClinicMutation(baseOptions?: Apollo.MutationHookOptions<CreateClinicMutation, CreateClinicMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateClinicMutation, CreateClinicMutationVariables>(CreateClinicDocument, options);
      }
export type CreateClinicMutationHookResult = ReturnType<typeof useCreateClinicMutation>;
export type CreateClinicMutationResult = Apollo.MutationResult<CreateClinicMutation>;
export type CreateClinicMutationOptions = Apollo.BaseMutationOptions<CreateClinicMutation, CreateClinicMutationVariables>;
export const CreatePatientDocument = gql`
    mutation createPatient($input: CreatePatientInput!) {
  createPatient(input: $input) {
    ok
    error
    patient {
      id
      name
      gender
      registrationNumber
      birthday
      memo
    }
  }
}
    `;
export type CreatePatientMutationFn = Apollo.MutationFunction<CreatePatientMutation, CreatePatientMutationVariables>;

/**
 * __useCreatePatientMutation__
 *
 * To run a mutation, you first call `useCreatePatientMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePatientMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPatientMutation, { data, loading, error }] = useCreatePatientMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePatientMutation(baseOptions?: Apollo.MutationHookOptions<CreatePatientMutation, CreatePatientMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePatientMutation, CreatePatientMutationVariables>(CreatePatientDocument, options);
      }
export type CreatePatientMutationHookResult = ReturnType<typeof useCreatePatientMutation>;
export type CreatePatientMutationResult = Apollo.MutationResult<CreatePatientMutation>;
export type CreatePatientMutationOptions = Apollo.BaseMutationOptions<CreatePatientMutation, CreatePatientMutationVariables>;
export const CreatePrescriptionDocument = gql`
    mutation createPrescription($input: CreatePrescriptionInput!) {
  createPrescription(input: $input) {
    ok
    error
  }
}
    `;
export type CreatePrescriptionMutationFn = Apollo.MutationFunction<CreatePrescriptionMutation, CreatePrescriptionMutationVariables>;

/**
 * __useCreatePrescriptionMutation__
 *
 * To run a mutation, you first call `useCreatePrescriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePrescriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPrescriptionMutation, { data, loading, error }] = useCreatePrescriptionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePrescriptionMutation(baseOptions?: Apollo.MutationHookOptions<CreatePrescriptionMutation, CreatePrescriptionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePrescriptionMutation, CreatePrescriptionMutationVariables>(CreatePrescriptionDocument, options);
      }
export type CreatePrescriptionMutationHookResult = ReturnType<typeof useCreatePrescriptionMutation>;
export type CreatePrescriptionMutationResult = Apollo.MutationResult<CreatePrescriptionMutation>;
export type CreatePrescriptionMutationOptions = Apollo.BaseMutationOptions<CreatePrescriptionMutation, CreatePrescriptionMutationVariables>;
export const CreateReservationDocument = gql`
    mutation createReservation($input: CreateReservationInput!) {
  createReservation(input: $input) {
    ok
    error
  }
}
    `;
export type CreateReservationMutationFn = Apollo.MutationFunction<CreateReservationMutation, CreateReservationMutationVariables>;

/**
 * __useCreateReservationMutation__
 *
 * To run a mutation, you first call `useCreateReservationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReservationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReservationMutation, { data, loading, error }] = useCreateReservationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateReservationMutation(baseOptions?: Apollo.MutationHookOptions<CreateReservationMutation, CreateReservationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateReservationMutation, CreateReservationMutationVariables>(CreateReservationDocument, options);
      }
export type CreateReservationMutationHookResult = ReturnType<typeof useCreateReservationMutation>;
export type CreateReservationMutationResult = Apollo.MutationResult<CreateReservationMutation>;
export type CreateReservationMutationOptions = Apollo.BaseMutationOptions<CreateReservationMutation, CreateReservationMutationVariables>;
export const DeleteReservationDocument = gql`
    mutation deleteReservation($input: DeleteReservationInput!) {
  deleteReservation(input: $input) {
    error
    ok
  }
}
    `;
export type DeleteReservationMutationFn = Apollo.MutationFunction<DeleteReservationMutation, DeleteReservationMutationVariables>;

/**
 * __useDeleteReservationMutation__
 *
 * To run a mutation, you first call `useDeleteReservationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteReservationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteReservationMutation, { data, loading, error }] = useDeleteReservationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteReservationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteReservationMutation, DeleteReservationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteReservationMutation, DeleteReservationMutationVariables>(DeleteReservationDocument, options);
      }
export type DeleteReservationMutationHookResult = ReturnType<typeof useDeleteReservationMutation>;
export type DeleteReservationMutationResult = Apollo.MutationResult<DeleteReservationMutation>;
export type DeleteReservationMutationOptions = Apollo.BaseMutationOptions<DeleteReservationMutation, DeleteReservationMutationVariables>;
export const EditPatientDocument = gql`
    mutation editPatient($input: EditPatientInput!) {
  editPatient(input: $input) {
    error
    ok
  }
}
    `;
export type EditPatientMutationFn = Apollo.MutationFunction<EditPatientMutation, EditPatientMutationVariables>;

/**
 * __useEditPatientMutation__
 *
 * To run a mutation, you first call `useEditPatientMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditPatientMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editPatientMutation, { data, loading, error }] = useEditPatientMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditPatientMutation(baseOptions?: Apollo.MutationHookOptions<EditPatientMutation, EditPatientMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditPatientMutation, EditPatientMutationVariables>(EditPatientDocument, options);
      }
export type EditPatientMutationHookResult = ReturnType<typeof useEditPatientMutation>;
export type EditPatientMutationResult = Apollo.MutationResult<EditPatientMutation>;
export type EditPatientMutationOptions = Apollo.BaseMutationOptions<EditPatientMutation, EditPatientMutationVariables>;
export const EditProfileDocument = gql`
    mutation editProfile($input: EditProfileInput!) {
  editProfile(input: $input) {
    ok
    error
  }
}
    `;
export type EditProfileMutationFn = Apollo.MutationFunction<EditProfileMutation, EditProfileMutationVariables>;

/**
 * __useEditProfileMutation__
 *
 * To run a mutation, you first call `useEditProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editProfileMutation, { data, loading, error }] = useEditProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditProfileMutation(baseOptions?: Apollo.MutationHookOptions<EditProfileMutation, EditProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditProfileMutation, EditProfileMutationVariables>(EditProfileDocument, options);
      }
export type EditProfileMutationHookResult = ReturnType<typeof useEditProfileMutation>;
export type EditProfileMutationResult = Apollo.MutationResult<EditProfileMutation>;
export type EditProfileMutationOptions = Apollo.BaseMutationOptions<EditProfileMutation, EditProfileMutationVariables>;
export const EditReservationDocument = gql`
    mutation editReservation($input: EditReservationInput!) {
  editReservation(input: $input) {
    error
    ok
  }
}
    `;
export type EditReservationMutationFn = Apollo.MutationFunction<EditReservationMutation, EditReservationMutationVariables>;

/**
 * __useEditReservationMutation__
 *
 * To run a mutation, you first call `useEditReservationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditReservationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editReservationMutation, { data, loading, error }] = useEditReservationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditReservationMutation(baseOptions?: Apollo.MutationHookOptions<EditReservationMutation, EditReservationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditReservationMutation, EditReservationMutationVariables>(EditReservationDocument, options);
      }
export type EditReservationMutationHookResult = ReturnType<typeof useEditReservationMutation>;
export type EditReservationMutationResult = Apollo.MutationResult<EditReservationMutation>;
export type EditReservationMutationOptions = Apollo.BaseMutationOptions<EditReservationMutation, EditReservationMutationVariables>;
export const FindAllPatientsDocument = gql`
    query findAllPatients($input: FindAllPatientsInput!) {
  findAllPatients(input: $input) {
    ok
    error
    totalPages
    totalCount
    results {
      id
      name
      gender
      registrationNumber
      birthday
      clinic {
        name
      }
    }
  }
}
    `;

/**
 * __useFindAllPatientsQuery__
 *
 * To run a query within a React component, call `useFindAllPatientsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllPatientsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllPatientsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useFindAllPatientsQuery(baseOptions: Apollo.QueryHookOptions<FindAllPatientsQuery, FindAllPatientsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllPatientsQuery, FindAllPatientsQueryVariables>(FindAllPatientsDocument, options);
      }
export function useFindAllPatientsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllPatientsQuery, FindAllPatientsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllPatientsQuery, FindAllPatientsQueryVariables>(FindAllPatientsDocument, options);
        }
export type FindAllPatientsQueryHookResult = ReturnType<typeof useFindAllPatientsQuery>;
export type FindAllPatientsLazyQueryHookResult = ReturnType<typeof useFindAllPatientsLazyQuery>;
export type FindAllPatientsQueryResult = Apollo.QueryResult<FindAllPatientsQuery, FindAllPatientsQueryVariables>;
export const FindAtomPrescriptionsDocument = gql`
    query findAtomPrescriptions {
  findAtomPrescriptions {
    ok
    error
    results {
      id
      name
    }
  }
}
    `;

/**
 * __useFindAtomPrescriptionsQuery__
 *
 * To run a query within a React component, call `useFindAtomPrescriptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAtomPrescriptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAtomPrescriptionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useFindAtomPrescriptionsQuery(baseOptions?: Apollo.QueryHookOptions<FindAtomPrescriptionsQuery, FindAtomPrescriptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAtomPrescriptionsQuery, FindAtomPrescriptionsQueryVariables>(FindAtomPrescriptionsDocument, options);
      }
export function useFindAtomPrescriptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAtomPrescriptionsQuery, FindAtomPrescriptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAtomPrescriptionsQuery, FindAtomPrescriptionsQueryVariables>(FindAtomPrescriptionsDocument, options);
        }
export type FindAtomPrescriptionsQueryHookResult = ReturnType<typeof useFindAtomPrescriptionsQuery>;
export type FindAtomPrescriptionsLazyQueryHookResult = ReturnType<typeof useFindAtomPrescriptionsLazyQuery>;
export type FindAtomPrescriptionsQueryResult = Apollo.QueryResult<FindAtomPrescriptionsQuery, FindAtomPrescriptionsQueryVariables>;
export const FindMyClinicsDocument = gql`
    query findMyClinics($input: FindMyClinicsInput!) {
  findMyClinics(input: $input) {
    ok
    error
    clinics {
      id
      name
      type
      isActivated
      members {
        id
        staying
        manager
        accepted
        user {
          id
          name
        }
        clinic {
          id
          name
        }
      }
    }
  }
}
    `;

/**
 * __useFindMyClinicsQuery__
 *
 * To run a query within a React component, call `useFindMyClinicsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindMyClinicsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindMyClinicsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useFindMyClinicsQuery(baseOptions: Apollo.QueryHookOptions<FindMyClinicsQuery, FindMyClinicsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindMyClinicsQuery, FindMyClinicsQueryVariables>(FindMyClinicsDocument, options);
      }
export function useFindMyClinicsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindMyClinicsQuery, FindMyClinicsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindMyClinicsQuery, FindMyClinicsQueryVariables>(FindMyClinicsDocument, options);
        }
export type FindMyClinicsQueryHookResult = ReturnType<typeof useFindMyClinicsQuery>;
export type FindMyClinicsLazyQueryHookResult = ReturnType<typeof useFindMyClinicsLazyQuery>;
export type FindMyClinicsQueryResult = Apollo.QueryResult<FindMyClinicsQuery, FindMyClinicsQueryVariables>;
export const FindPrescriptionsDocument = gql`
    query findPrescriptions($input: FindPrescriptionsInput!) {
  findPrescriptions(input: $input) {
    ok
    error
    prescriptions {
      id
      name
      requiredTime
      description
      price
      activate
      prescriptionAtoms {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useFindPrescriptionsQuery__
 *
 * To run a query within a React component, call `useFindPrescriptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindPrescriptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindPrescriptionsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useFindPrescriptionsQuery(baseOptions: Apollo.QueryHookOptions<FindPrescriptionsQuery, FindPrescriptionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindPrescriptionsQuery, FindPrescriptionsQueryVariables>(FindPrescriptionsDocument, options);
      }
export function useFindPrescriptionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindPrescriptionsQuery, FindPrescriptionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindPrescriptionsQuery, FindPrescriptionsQueryVariables>(FindPrescriptionsDocument, options);
        }
export type FindPrescriptionsQueryHookResult = ReturnType<typeof useFindPrescriptionsQuery>;
export type FindPrescriptionsLazyQueryHookResult = ReturnType<typeof useFindPrescriptionsLazyQuery>;
export type FindPrescriptionsQueryResult = Apollo.QueryResult<FindPrescriptionsQuery, FindPrescriptionsQueryVariables>;
export const GetClinicDocument = gql`
    query getClinic($input: GetClinicInput!) {
  getClinic(input: $input) {
    ok
    error
    clinic {
      id
      name
      members {
        id
        staying
        manager
        accepted
        user {
          id
          name
          email
        }
      }
    }
  }
}
    `;

/**
 * __useGetClinicQuery__
 *
 * To run a query within a React component, call `useGetClinicQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClinicQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClinicQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetClinicQuery(baseOptions: Apollo.QueryHookOptions<GetClinicQuery, GetClinicQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetClinicQuery, GetClinicQueryVariables>(GetClinicDocument, options);
      }
export function useGetClinicLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetClinicQuery, GetClinicQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetClinicQuery, GetClinicQueryVariables>(GetClinicDocument, options);
        }
export type GetClinicQueryHookResult = ReturnType<typeof useGetClinicQuery>;
export type GetClinicLazyQueryHookResult = ReturnType<typeof useGetClinicLazyQuery>;
export type GetClinicQueryResult = Apollo.QueryResult<GetClinicQuery, GetClinicQueryVariables>;
export const GetPatientsDocument = gql`
    query getPatients($input: GetPatientsInput!) {
  getPatients(input: $input) {
    ok
    error
    patients {
      id
      name
      gender
      registrationNumber
      birthday
      memo
    }
  }
}
    `;

/**
 * __useGetPatientsQuery__
 *
 * To run a query within a React component, call `useGetPatientsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPatientsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPatientsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetPatientsQuery(baseOptions: Apollo.QueryHookOptions<GetPatientsQuery, GetPatientsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPatientsQuery, GetPatientsQueryVariables>(GetPatientsDocument, options);
      }
export function useGetPatientsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPatientsQuery, GetPatientsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPatientsQuery, GetPatientsQueryVariables>(GetPatientsDocument, options);
        }
export type GetPatientsQueryHookResult = ReturnType<typeof useGetPatientsQuery>;
export type GetPatientsLazyQueryHookResult = ReturnType<typeof useGetPatientsLazyQuery>;
export type GetPatientsQueryResult = Apollo.QueryResult<GetPatientsQuery, GetPatientsQueryVariables>;
export const GetStatisticsDocument = gql`
    query getStatistics($input: GetStatisticsInput!) {
  getStatistics(input: $input) {
    error
    ok
    prescriptions {
      id
      name
      price
      requiredTime
    }
    visitRates {
      patientId
      visited
    }
    dailyReports {
      date
      reservationCount
      noshow
      cancel
      newPatient
      users {
        userId
        reservationCount
        noshow
        cancel
        newPatient
        visitMoreThanThirty
        visitMoreThanSixty
        visitMoreThanNinety
        prescriptions {
          id
          name
          count
        }
        reservations {
          id
          startDate
          endDate
          state
          memo
          isFirst
          prescriptions {
            id
            name
            price
            requiredTime
          }
          patient {
            id
            name
          }
          lastModifier {
            id
            name
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetStatisticsQuery__
 *
 * To run a query within a React component, call `useGetStatisticsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStatisticsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStatisticsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetStatisticsQuery(baseOptions: Apollo.QueryHookOptions<GetStatisticsQuery, GetStatisticsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStatisticsQuery, GetStatisticsQueryVariables>(GetStatisticsDocument, options);
      }
export function useGetStatisticsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStatisticsQuery, GetStatisticsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStatisticsQuery, GetStatisticsQueryVariables>(GetStatisticsDocument, options);
        }
export type GetStatisticsQueryHookResult = ReturnType<typeof useGetStatisticsQuery>;
export type GetStatisticsLazyQueryHookResult = ReturnType<typeof useGetStatisticsLazyQuery>;
export type GetStatisticsQueryResult = Apollo.QueryResult<GetStatisticsQuery, GetStatisticsQueryVariables>;
export const InviteClinicDocument = gql`
    mutation inviteClinic($input: InviteClinicInput!) {
  inviteClinic(input: $input) {
    ok
    error
  }
}
    `;
export type InviteClinicMutationFn = Apollo.MutationFunction<InviteClinicMutation, InviteClinicMutationVariables>;

/**
 * __useInviteClinicMutation__
 *
 * To run a mutation, you first call `useInviteClinicMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInviteClinicMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inviteClinicMutation, { data, loading, error }] = useInviteClinicMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useInviteClinicMutation(baseOptions?: Apollo.MutationHookOptions<InviteClinicMutation, InviteClinicMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InviteClinicMutation, InviteClinicMutationVariables>(InviteClinicDocument, options);
      }
export type InviteClinicMutationHookResult = ReturnType<typeof useInviteClinicMutation>;
export type InviteClinicMutationResult = Apollo.MutationResult<InviteClinicMutation>;
export type InviteClinicMutationOptions = Apollo.BaseMutationOptions<InviteClinicMutation, InviteClinicMutationVariables>;
export const LeaveClinicDocument = gql`
    mutation leaveClinic($input: LeaveClinicInput!) {
  leaveClinic(input: $input) {
    ok
    error
  }
}
    `;
export type LeaveClinicMutationFn = Apollo.MutationFunction<LeaveClinicMutation, LeaveClinicMutationVariables>;

/**
 * __useLeaveClinicMutation__
 *
 * To run a mutation, you first call `useLeaveClinicMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveClinicMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveClinicMutation, { data, loading, error }] = useLeaveClinicMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLeaveClinicMutation(baseOptions?: Apollo.MutationHookOptions<LeaveClinicMutation, LeaveClinicMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LeaveClinicMutation, LeaveClinicMutationVariables>(LeaveClinicDocument, options);
      }
export type LeaveClinicMutationHookResult = ReturnType<typeof useLeaveClinicMutation>;
export type LeaveClinicMutationResult = Apollo.MutationResult<LeaveClinicMutation>;
export type LeaveClinicMutationOptions = Apollo.BaseMutationOptions<LeaveClinicMutation, LeaveClinicMutationVariables>;
export const ListReservationsDocument = gql`
    query listReservations($input: ListReservationsInput!) {
  listReservations(input: $input) {
    ok
    totalCount
    results {
      id
      startDate
      endDate
      state
      memo
      isFirst
      user {
        id
        name
      }
      patient {
        id
        name
        gender
        registrationNumber
        birthday
        memo
      }
      lastModifier {
        id
        email
        name
        updatedAt
      }
      clinic {
        id
        name
      }
      prescriptions {
        id
        name
        requiredTime
        description
        price
      }
    }
  }
}
    `;

/**
 * __useListReservationsQuery__
 *
 * To run a query within a React component, call `useListReservationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListReservationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListReservationsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useListReservationsQuery(baseOptions: Apollo.QueryHookOptions<ListReservationsQuery, ListReservationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListReservationsQuery, ListReservationsQueryVariables>(ListReservationsDocument, options);
      }
export function useListReservationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListReservationsQuery, ListReservationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListReservationsQuery, ListReservationsQueryVariables>(ListReservationsDocument, options);
        }
export type ListReservationsQueryHookResult = ReturnType<typeof useListReservationsQuery>;
export type ListReservationsLazyQueryHookResult = ReturnType<typeof useListReservationsLazyQuery>;
export type ListReservationsQueryResult = Apollo.QueryResult<ListReservationsQuery, ListReservationsQueryVariables>;
export const LoginDocument = gql`
    mutation login($input: LoginInput!) {
  login(input: $input) {
    ok
    token
    error
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const MeDocument = gql`
    query me {
  me {
    id
    name
    email
    role
    verified
    members {
      id
      staying
      manager
      accepted
      clinic {
        id
        name
        isActivated
        type
      }
    }
    notice {
      message
      read
    }
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const SearchPatientDocument = gql`
    query searchPatient($input: SearchPatientInput!) {
  searchPatient(input: $input) {
    error
    ok
    totalPages
    totalCount
    patients {
      id
      name
      gender
      registrationNumber
      birthday
      clinic {
        id
        name
      }
      users {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useSearchPatientQuery__
 *
 * To run a query within a React component, call `useSearchPatientQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchPatientQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchPatientQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSearchPatientQuery(baseOptions: Apollo.QueryHookOptions<SearchPatientQuery, SearchPatientQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchPatientQuery, SearchPatientQueryVariables>(SearchPatientDocument, options);
      }
export function useSearchPatientLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchPatientQuery, SearchPatientQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchPatientQuery, SearchPatientQueryVariables>(SearchPatientDocument, options);
        }
export type SearchPatientQueryHookResult = ReturnType<typeof useSearchPatientQuery>;
export type SearchPatientLazyQueryHookResult = ReturnType<typeof useSearchPatientLazyQuery>;
export type SearchPatientQueryResult = Apollo.QueryResult<SearchPatientQuery, SearchPatientQueryVariables>;
export const SearchUsersDocument = gql`
    query searchUsers($input: SearchUsersInput!) {
  searchUsers(input: $input) {
    ok
    error
    totalCount
    results {
      id
      name
      email
    }
  }
}
    `;

/**
 * __useSearchUsersQuery__
 *
 * To run a query within a React component, call `useSearchUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUsersQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSearchUsersQuery(baseOptions: Apollo.QueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
      }
export function useSearchUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
        }
export type SearchUsersQueryHookResult = ReturnType<typeof useSearchUsersQuery>;
export type SearchUsersLazyQueryHookResult = ReturnType<typeof useSearchUsersLazyQuery>;
export type SearchUsersQueryResult = Apollo.QueryResult<SearchUsersQuery, SearchUsersQueryVariables>;
export const VerifyEmailDocument = gql`
    mutation verifyEmail($input: VerifyEmailInput!) {
  verifyEmail(input: $input) {
    ok
    error
  }
}
    `;
export type VerifyEmailMutationFn = Apollo.MutationFunction<VerifyEmailMutation, VerifyEmailMutationVariables>;

/**
 * __useVerifyEmailMutation__
 *
 * To run a mutation, you first call `useVerifyEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyEmailMutation, { data, loading, error }] = useVerifyEmailMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useVerifyEmailMutation(baseOptions?: Apollo.MutationHookOptions<VerifyEmailMutation, VerifyEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VerifyEmailDocument, options);
      }
export type VerifyEmailMutationHookResult = ReturnType<typeof useVerifyEmailMutation>;
export type VerifyEmailMutationResult = Apollo.MutationResult<VerifyEmailMutation>;
export type VerifyEmailMutationOptions = Apollo.BaseMutationOptions<VerifyEmailMutation, VerifyEmailMutationVariables>;