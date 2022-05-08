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
  groupId: Scalars['Int'];
};

export type AcceptInvitationOutput = {
  __typename?: 'AcceptInvitationOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

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

export type CreateGroupInput = {
  name: Scalars['String'];
};

export type CreateGroupOutput = {
  __typename?: 'CreateGroupOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type CreatePatientInput = {
  birthday?: InputMaybe<Scalars['DateTime']>;
  gender?: InputMaybe<Scalars['String']>;
  memo?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  registrationNumber?: InputMaybe<Scalars['String']>;
};

export type CreatePatientOutput = {
  __typename?: 'CreatePatientOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  patient: Patient;
};

export type CreatePrescriptionInput = {
  description?: InputMaybe<Scalars['String']>;
  groupId?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  prescriptionId?: InputMaybe<Scalars['Int']>;
  prescriptionOptionIds?: InputMaybe<Array<Scalars['Int']>>;
  price: Scalars['Int'];
  requiredTime: Scalars['Int'];
};

export type CreatePrescriptionOutput = {
  __typename?: 'CreatePrescriptionOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type CreateReservationInput = {
  endDate: Scalars['DateTime'];
  groupId?: InputMaybe<Scalars['Float']>;
  memo?: InputMaybe<Scalars['String']>;
  patientId: Scalars['Float'];
  prescriptionBundleIds?: InputMaybe<Array<Scalars['Float']>>;
  prescriptionOptionIds?: InputMaybe<Array<Scalars['Float']>>;
  startDate: Scalars['DateTime'];
  therapistId?: InputMaybe<Scalars['Float']>;
};

export type CreateReservationOutput = {
  __typename?: 'CreateReservationOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  reservation?: Maybe<Reservation>;
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
  gender?: InputMaybe<Scalars['String']>;
  memo?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  registrationNumber?: InputMaybe<Scalars['String']>;
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
  groupId?: InputMaybe<Scalars['Int']>;
  memo?: InputMaybe<Scalars['String']>;
  reservationId: Scalars['Int'];
  startDate?: InputMaybe<Scalars['DateTime']>;
  state?: InputMaybe<ReservationState>;
};

export type EditReservationOutput = {
  __typename?: 'EditReservationOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type FindAllPatientsInput = {
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

export type FindGroupByIdInput = {
  groupId: Scalars['Int'];
};

export type FindGroupByIdOutput = {
  __typename?: 'FindGroupByIdOutput';
  error?: Maybe<Scalars['String']>;
  group?: Maybe<Group>;
  ok: Scalars['Boolean'];
};

export type FindMyGroupsInput = {
  includeField: Scalars['String'];
};

export type FindMyGroupsOutput = {
  __typename?: 'FindMyGroupsOutput';
  error?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<Group>>;
  ok: Scalars['Boolean'];
};

export type FindPatientByIdInput = {
  patientId: Scalars['Int'];
};

export type FindPatientByIdOutput = {
  __typename?: 'FindPatientByIdOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  patient?: Maybe<Patient>;
};

export type FindPrescriptionsInput = {
  groupId?: InputMaybe<Scalars['Int']>;
  includeInactivate: Scalars['Boolean'];
  prescriptionType: Scalars['String'];
};

export type FindPrescriptionsOutput = {
  __typename?: 'FindPrescriptionsOutput';
  bundleResults?: Maybe<Array<PrescriptionBundle>>;
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  optionResults?: Maybe<Array<PrescriptionOption>>;
};

export type FindReservationByIdInput = {
  reservationId: Scalars['Int'];
};

export type FindReservationByIdOutput = {
  __typename?: 'FindReservationByIdOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  reservation?: Maybe<Reservation>;
};

export type FindReservationByPatientInput = {
  groupId?: InputMaybe<Scalars['Int']>;
  page?: InputMaybe<Scalars['Int']>;
  patientId?: InputMaybe<Scalars['Int']>;
};

export type FindReservationByPatientOutput = {
  __typename?: 'FindReservationByPatientOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  results?: Maybe<Array<Reservation>>;
  totalCount?: Maybe<Scalars['Int']>;
  totalPages?: Maybe<Scalars['Int']>;
};

export type Group = {
  __typename?: 'Group';
  activate: Scalars['Boolean'];
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['Float'];
  members: Array<GroupMember>;
  name: Scalars['String'];
  patient?: Maybe<Array<Patient>>;
  prescriptions: Array<PrescriptionOption>;
  reservations?: Maybe<Array<Reservation>>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type GroupMember = {
  __typename?: 'GroupMember';
  accepted: Scalars['Boolean'];
  createdAt?: Maybe<Scalars['DateTime']>;
  group: Group;
  groupId: Scalars['Int'];
  id: Scalars['Float'];
  manager: Scalars['Boolean'];
  staying: Scalars['Boolean'];
  updatedAt?: Maybe<Scalars['DateTime']>;
  user: User;
};

export type InactivateGroupInput = {
  groupId: Scalars['Int'];
};

export type InactivateGroupOutput = {
  __typename?: 'InactivateGroupOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type InviteGroupInput = {
  groupId: Scalars['Int'];
  userIds: Array<Scalars['Int']>;
};

export type InviteGroupOutput = {
  __typename?: 'InviteGroupOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type LeaveGroupInput = {
  groupId: Scalars['Int'];
};

export type LeaveGroupOutput = {
  __typename?: 'LeaveGroupOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type ListReservationsInput = {
  date: Scalars['DateTime'];
  groupIds?: InputMaybe<Array<Scalars['Int']>>;
  viewOption: Scalars['Int'];
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

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvitation: AcceptInvitationOutput;
  createAccount: CreateAccountOutput;
  createAtomPrescription: CreateAtomPrescriptionOutput;
  createGroup: CreateGroupOutput;
  createPatient: CreatePatientOutput;
  createPrescription: CreatePrescriptionOutput;
  createReservation: CreateReservationOutput;
  deletePatient: DeletePatientOutput;
  deleteReservation: DeleteReservationOutput;
  editPatient: EditPatientOutput;
  editProfile: EditProfileOutput;
  editReservation: EditReservationOutput;
  inactivateGroup: InactivateGroupOutput;
  inviteGroup: InviteGroupOutput;
  leaveGroup: LeaveGroupOutput;
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


export type MutationCreateGroupArgs = {
  input: CreateGroupInput;
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


export type MutationInactivateGroupArgs = {
  input: InactivateGroupInput;
};


export type MutationInviteGroupArgs = {
  input: InviteGroupInput;
};


export type MutationLeaveGroupArgs = {
  input: LeaveGroupInput;
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
  createdAt?: Maybe<Scalars['DateTime']>;
  gender: Scalars['String'];
  id: Scalars['Float'];
  memo?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  registrationNumber?: Maybe<Scalars['String']>;
  therapists: Array<User>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type PrescriptionAtom = {
  __typename?: 'PrescriptionAtom';
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['Float'];
  name: Scalars['String'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type PrescriptionBundle = {
  __typename?: 'PrescriptionBundle';
  activate: Scalars['Boolean'];
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['Float'];
  name: Scalars['String'];
  prescriptionOptions: Array<PrescriptionOption>;
  price: Scalars['Int'];
  requiredTime: Scalars['Int'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type PrescriptionOption = {
  __typename?: 'PrescriptionOption';
  activate: Scalars['Boolean'];
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['Float'];
  name: Scalars['String'];
  prescription: PrescriptionAtom;
  price: Scalars['Int'];
  requiredTime: Scalars['Int'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type Query = {
  __typename?: 'Query';
  findAllPatients: FindAllPatientsOutput;
  findAtomPrescriptions: FindAtomPrescriptionsOutput;
  findGroupById: FindGroupByIdOutput;
  findMyGroups: FindMyGroupsOutput;
  findPatientById: FindPatientByIdOutput;
  findPrescriptions: FindPrescriptionsOutput;
  findReservationById: FindReservationByIdOutput;
  findReservationByPatient: FindReservationByPatientOutput;
  listReservations: ListReservationsOutput;
  me: User;
  searchPatientByName: SearchPatientOutput;
  searchUsersByName: SearchUsersByNameOutput;
  userProfile: UserProfileOutput;
};


export type QueryFindAllPatientsArgs = {
  input: FindAllPatientsInput;
};


export type QueryFindGroupByIdArgs = {
  input: FindGroupByIdInput;
};


export type QueryFindMyGroupsArgs = {
  input: FindMyGroupsInput;
};


export type QueryFindPatientByIdArgs = {
  input: FindPatientByIdInput;
};


export type QueryFindPrescriptionsArgs = {
  input: FindPrescriptionsInput;
};


export type QueryFindReservationByIdArgs = {
  input: FindReservationByIdInput;
};


export type QueryFindReservationByPatientArgs = {
  input: FindReservationByPatientInput;
};


export type QueryListReservationsArgs = {
  input: ListReservationsInput;
};


export type QuerySearchPatientByNameArgs = {
  input: SearchPatientInput;
};


export type QuerySearchUsersByNameArgs = {
  input: SearchUsersByNameInput;
};


export type QueryUserProfileArgs = {
  userId: Scalars['Float'];
};

export type Reservation = {
  __typename?: 'Reservation';
  createdAt?: Maybe<Scalars['DateTime']>;
  endDate: Scalars['DateTime'];
  group?: Maybe<Group>;
  id: Scalars['Float'];
  lastModifier: User;
  memo?: Maybe<Scalars['String']>;
  patient: Patient;
  prescriptionBundles?: Maybe<Array<PrescriptionBundle>>;
  prescriptionOptions?: Maybe<Array<PrescriptionOption>>;
  startDate: Scalars['DateTime'];
  state: ReservationState;
  therapist: User;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export enum ReservationState {
  Canceled = 'Canceled',
  NoShow = 'NoShow',
  Reserved = 'Reserved'
}

export type SearchPatientInput = {
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

export type SearchUsersByNameInput = {
  name: Scalars['String'];
};

export type SearchUsersByNameOutput = {
  __typename?: 'SearchUsersByNameOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  results?: Maybe<Array<User>>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type User = {
  __typename?: 'User';
  createdAt?: Maybe<Scalars['DateTime']>;
  email: Scalars['String'];
  groups?: Maybe<Array<GroupMember>>;
  id: Scalars['Float'];
  name: Scalars['String'];
  notice?: Maybe<Array<Notice>>;
  password: Scalars['String'];
  prescriptions: Array<PrescriptionOption>;
  role: UserRole;
  updatedAt?: Maybe<Scalars['DateTime']>;
  verified: Scalars['Boolean'];
};

export type UserProfileOutput = {
  __typename?: 'UserProfileOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  user?: Maybe<User>;
};

export enum UserRole {
  Client = 'Client',
  Customer = 'Customer',
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

export type AcceptInvitationMutationVariables = Exact<{
  input: AcceptInvitationInput;
}>;


export type AcceptInvitationMutation = { __typename?: 'Mutation', acceptInvitation: { __typename?: 'AcceptInvitationOutput', ok: boolean, error?: string | null } };

export type InactivateGroupMutationVariables = Exact<{
  input: InactivateGroupInput;
}>;


export type InactivateGroupMutation = { __typename?: 'Mutation', inactivateGroup: { __typename?: 'InactivateGroupOutput', ok: boolean, error?: string | null } };

export type CreateAccountMutationVariables = Exact<{
  input: CreateAccountInput;
}>;


export type CreateAccountMutation = { __typename?: 'Mutation', createAccount: { __typename?: 'CreateAccountOutput', ok: boolean, error?: string | null } };

export type CreateGroupMutationVariables = Exact<{
  input: CreateGroupInput;
}>;


export type CreateGroupMutation = { __typename?: 'Mutation', createGroup: { __typename?: 'CreateGroupOutput', ok: boolean, error?: string | null } };

export type CreatePatientMutationVariables = Exact<{
  input: CreatePatientInput;
}>;


export type CreatePatientMutation = { __typename?: 'Mutation', createPatient: { __typename?: 'CreatePatientOutput', ok: boolean, error?: string | null, patient: { __typename?: 'Patient', id: number, name: string, gender: string, registrationNumber?: string | null, birthday?: any | null, memo?: string | null } } };

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


export type FindAllPatientsQuery = { __typename?: 'Query', findAllPatients: { __typename?: 'FindAllPatientsOutput', ok: boolean, error?: string | null, totalPages?: number | null, totalCount?: number | null, results?: Array<{ __typename?: 'Patient', id: number, name: string, gender: string, registrationNumber?: string | null, birthday?: any | null }> | null } };

export type FindAtomPrescriptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type FindAtomPrescriptionsQuery = { __typename?: 'Query', findAtomPrescriptions: { __typename?: 'FindAtomPrescriptionsOutput', ok: boolean, error?: string | null, results?: Array<{ __typename?: 'PrescriptionAtom', id: number, name: string }> | null } };

export type FindGroupByIdQueryVariables = Exact<{
  input: FindGroupByIdInput;
}>;


export type FindGroupByIdQuery = { __typename?: 'Query', findGroupById: { __typename?: 'FindGroupByIdOutput', ok: boolean, error?: string | null, group?: { __typename?: 'Group', id: number, name: string, members: Array<{ __typename?: 'GroupMember', id: number, staying: boolean, manager: boolean, accepted: boolean, user: { __typename?: 'User', id: number, name: string, email: string } }> } | null } };

export type FindMyGroupsQueryVariables = Exact<{
  input: FindMyGroupsInput;
}>;


export type FindMyGroupsQuery = { __typename?: 'Query', findMyGroups: { __typename?: 'FindMyGroupsOutput', ok: boolean, error?: string | null, groups?: Array<{ __typename?: 'Group', id: number, name: string, activate: boolean, members: Array<{ __typename?: 'GroupMember', id: number, staying: boolean, manager: boolean, accepted: boolean, user: { __typename?: 'User', id: number, name: string }, group: { __typename?: 'Group', id: number, name: string } }> }> | null } };

export type FindPrescriptionsQueryVariables = Exact<{
  input: FindPrescriptionsInput;
}>;


export type FindPrescriptionsQuery = { __typename?: 'Query', findPrescriptions: { __typename?: 'FindPrescriptionsOutput', ok: boolean, error?: string | null, optionResults?: Array<{ __typename?: 'PrescriptionOption', id: number, name: string, requiredTime: number, description?: string | null, price: number, activate: boolean, prescription: { __typename?: 'PrescriptionAtom', name: string } }> | null, bundleResults?: Array<{ __typename?: 'PrescriptionBundle', id: number, name: string, requiredTime: number, description?: string | null, price: number, activate: boolean, prescriptionOptions: Array<{ __typename?: 'PrescriptionOption', id: number, name: string, requiredTime: number, description?: string | null, price: number, activate: boolean, prescription: { __typename?: 'PrescriptionAtom', name: string } }> }> | null } };

export type FindReservationByIdQueryVariables = Exact<{
  input: FindReservationByIdInput;
}>;


export type FindReservationByIdQuery = { __typename?: 'Query', findReservationById: { __typename?: 'FindReservationByIdOutput', error?: string | null, ok: boolean, reservation?: { __typename?: 'Reservation', id: number, startDate: any, endDate: any, state: ReservationState, memo?: string | null, therapist: { __typename?: 'User', id: number, name: string, email: string }, patient: { __typename?: 'Patient', id: number, name: string, gender: string, registrationNumber?: string | null, birthday?: any | null }, group?: { __typename?: 'Group', id: number, name: string } | null, lastModifier: { __typename?: 'User', id: number, name: string, email: string } } | null } };

export type InviteGroupMutationVariables = Exact<{
  input: InviteGroupInput;
}>;


export type InviteGroupMutation = { __typename?: 'Mutation', inviteGroup: { __typename?: 'InviteGroupOutput', ok: boolean, error?: string | null } };

export type LeaveGroupMutationVariables = Exact<{
  input: LeaveGroupInput;
}>;


export type LeaveGroupMutation = { __typename?: 'Mutation', leaveGroup: { __typename?: 'LeaveGroupOutput', ok: boolean, error?: string | null } };

export type ListReservationsQueryVariables = Exact<{
  input: ListReservationsInput;
}>;


export type ListReservationsQuery = { __typename?: 'Query', listReservations: { __typename?: 'ListReservationsOutput', ok: boolean, totalCount?: number | null, results?: Array<{ __typename?: 'Reservation', id: number, startDate: any, endDate: any, state: ReservationState, memo?: string | null, therapist: { __typename?: 'User', id: number, name: string }, patient: { __typename?: 'Patient', id: number, name: string, gender: string, registrationNumber?: string | null, birthday?: any | null }, lastModifier: { __typename?: 'User', id: number, email: string, name: string }, group?: { __typename?: 'Group', id: number, name: string } | null }> | null } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginOutput', ok: boolean, token?: string | null, error?: string | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: number, name: string, email: string, role: UserRole, verified: boolean, groups?: Array<{ __typename?: 'GroupMember', id: number, staying: boolean, manager: boolean, accepted: boolean, group: { __typename?: 'Group', id: number, name: string, activate: boolean } }> | null, notice?: Array<{ __typename?: 'Notice', message: string, read: boolean }> | null } };

export type SearchPatientByNameQueryVariables = Exact<{
  input: SearchPatientInput;
}>;


export type SearchPatientByNameQuery = { __typename?: 'Query', searchPatientByName: { __typename?: 'SearchPatientOutput', error?: string | null, ok: boolean, totalPages?: number | null, totalCount?: number | null, patients?: Array<{ __typename?: 'Patient', id: number, name: string, gender: string, registrationNumber?: string | null, birthday?: any | null }> | null } };

export type FindPatientByIdQueryVariables = Exact<{
  input: FindPatientByIdInput;
}>;


export type FindPatientByIdQuery = { __typename?: 'Query', findPatientById: { __typename?: 'FindPatientByIdOutput', ok: boolean, error?: string | null, patient?: { __typename?: 'Patient', id: number, name: string, gender: string, registrationNumber?: string | null, birthday?: any | null, memo?: string | null } | null } };

export type SearchUsersByNameQueryVariables = Exact<{
  input: SearchUsersByNameInput;
}>;


export type SearchUsersByNameQuery = { __typename?: 'Query', searchUsersByName: { __typename?: 'SearchUsersByNameOutput', ok: boolean, error?: string | null, totalCount?: number | null, results?: Array<{ __typename?: 'User', id: number, name: string, email: string }> | null } };

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
export const InactivateGroupDocument = gql`
    mutation inactivateGroup($input: InactivateGroupInput!) {
  inactivateGroup(input: $input) {
    ok
    error
  }
}
    `;
export type InactivateGroupMutationFn = Apollo.MutationFunction<InactivateGroupMutation, InactivateGroupMutationVariables>;

/**
 * __useInactivateGroupMutation__
 *
 * To run a mutation, you first call `useInactivateGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInactivateGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inactivateGroupMutation, { data, loading, error }] = useInactivateGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useInactivateGroupMutation(baseOptions?: Apollo.MutationHookOptions<InactivateGroupMutation, InactivateGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InactivateGroupMutation, InactivateGroupMutationVariables>(InactivateGroupDocument, options);
      }
export type InactivateGroupMutationHookResult = ReturnType<typeof useInactivateGroupMutation>;
export type InactivateGroupMutationResult = Apollo.MutationResult<InactivateGroupMutation>;
export type InactivateGroupMutationOptions = Apollo.BaseMutationOptions<InactivateGroupMutation, InactivateGroupMutationVariables>;
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
export const CreateGroupDocument = gql`
    mutation createGroup($input: CreateGroupInput!) {
  createGroup(input: $input) {
    ok
    error
  }
}
    `;
export type CreateGroupMutationFn = Apollo.MutationFunction<CreateGroupMutation, CreateGroupMutationVariables>;

/**
 * __useCreateGroupMutation__
 *
 * To run a mutation, you first call `useCreateGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGroupMutation, { data, loading, error }] = useCreateGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGroupMutation(baseOptions?: Apollo.MutationHookOptions<CreateGroupMutation, CreateGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateGroupMutation, CreateGroupMutationVariables>(CreateGroupDocument, options);
      }
export type CreateGroupMutationHookResult = ReturnType<typeof useCreateGroupMutation>;
export type CreateGroupMutationResult = Apollo.MutationResult<CreateGroupMutation>;
export type CreateGroupMutationOptions = Apollo.BaseMutationOptions<CreateGroupMutation, CreateGroupMutationVariables>;
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
export const FindGroupByIdDocument = gql`
    query findGroupById($input: FindGroupByIdInput!) {
  findGroupById(input: $input) {
    ok
    error
    group {
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
 * __useFindGroupByIdQuery__
 *
 * To run a query within a React component, call `useFindGroupByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindGroupByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindGroupByIdQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useFindGroupByIdQuery(baseOptions: Apollo.QueryHookOptions<FindGroupByIdQuery, FindGroupByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindGroupByIdQuery, FindGroupByIdQueryVariables>(FindGroupByIdDocument, options);
      }
export function useFindGroupByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindGroupByIdQuery, FindGroupByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindGroupByIdQuery, FindGroupByIdQueryVariables>(FindGroupByIdDocument, options);
        }
export type FindGroupByIdQueryHookResult = ReturnType<typeof useFindGroupByIdQuery>;
export type FindGroupByIdLazyQueryHookResult = ReturnType<typeof useFindGroupByIdLazyQuery>;
export type FindGroupByIdQueryResult = Apollo.QueryResult<FindGroupByIdQuery, FindGroupByIdQueryVariables>;
export const FindMyGroupsDocument = gql`
    query findMyGroups($input: FindMyGroupsInput!) {
  findMyGroups(input: $input) {
    ok
    error
    groups {
      id
      name
      activate
      members {
        id
        staying
        manager
        accepted
        user {
          id
          name
        }
        group {
          id
          name
        }
      }
    }
  }
}
    `;

/**
 * __useFindMyGroupsQuery__
 *
 * To run a query within a React component, call `useFindMyGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindMyGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindMyGroupsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useFindMyGroupsQuery(baseOptions: Apollo.QueryHookOptions<FindMyGroupsQuery, FindMyGroupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindMyGroupsQuery, FindMyGroupsQueryVariables>(FindMyGroupsDocument, options);
      }
export function useFindMyGroupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindMyGroupsQuery, FindMyGroupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindMyGroupsQuery, FindMyGroupsQueryVariables>(FindMyGroupsDocument, options);
        }
export type FindMyGroupsQueryHookResult = ReturnType<typeof useFindMyGroupsQuery>;
export type FindMyGroupsLazyQueryHookResult = ReturnType<typeof useFindMyGroupsLazyQuery>;
export type FindMyGroupsQueryResult = Apollo.QueryResult<FindMyGroupsQuery, FindMyGroupsQueryVariables>;
export const FindPrescriptionsDocument = gql`
    query findPrescriptions($input: FindPrescriptionsInput!) {
  findPrescriptions(input: $input) {
    ok
    error
    optionResults {
      id
      name
      requiredTime
      description
      price
      prescription {
        name
      }
      activate
    }
    bundleResults {
      id
      name
      requiredTime
      description
      price
      prescriptionOptions {
        id
        name
        requiredTime
        description
        price
        prescription {
          name
        }
        activate
      }
      activate
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
export const FindReservationByIdDocument = gql`
    query findReservationById($input: FindReservationByIdInput!) {
  findReservationById(input: $input) {
    error
    ok
    reservation {
      id
      startDate
      endDate
      state
      memo
      therapist {
        id
        name
        email
      }
      patient {
        id
        name
        gender
        registrationNumber
        birthday
      }
      group {
        id
        name
      }
      lastModifier {
        id
        name
        email
      }
    }
  }
}
    `;

/**
 * __useFindReservationByIdQuery__
 *
 * To run a query within a React component, call `useFindReservationByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindReservationByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindReservationByIdQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useFindReservationByIdQuery(baseOptions: Apollo.QueryHookOptions<FindReservationByIdQuery, FindReservationByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindReservationByIdQuery, FindReservationByIdQueryVariables>(FindReservationByIdDocument, options);
      }
export function useFindReservationByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindReservationByIdQuery, FindReservationByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindReservationByIdQuery, FindReservationByIdQueryVariables>(FindReservationByIdDocument, options);
        }
export type FindReservationByIdQueryHookResult = ReturnType<typeof useFindReservationByIdQuery>;
export type FindReservationByIdLazyQueryHookResult = ReturnType<typeof useFindReservationByIdLazyQuery>;
export type FindReservationByIdQueryResult = Apollo.QueryResult<FindReservationByIdQuery, FindReservationByIdQueryVariables>;
export const InviteGroupDocument = gql`
    mutation inviteGroup($input: InviteGroupInput!) {
  inviteGroup(input: $input) {
    ok
    error
  }
}
    `;
export type InviteGroupMutationFn = Apollo.MutationFunction<InviteGroupMutation, InviteGroupMutationVariables>;

/**
 * __useInviteGroupMutation__
 *
 * To run a mutation, you first call `useInviteGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInviteGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inviteGroupMutation, { data, loading, error }] = useInviteGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useInviteGroupMutation(baseOptions?: Apollo.MutationHookOptions<InviteGroupMutation, InviteGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InviteGroupMutation, InviteGroupMutationVariables>(InviteGroupDocument, options);
      }
export type InviteGroupMutationHookResult = ReturnType<typeof useInviteGroupMutation>;
export type InviteGroupMutationResult = Apollo.MutationResult<InviteGroupMutation>;
export type InviteGroupMutationOptions = Apollo.BaseMutationOptions<InviteGroupMutation, InviteGroupMutationVariables>;
export const LeaveGroupDocument = gql`
    mutation leaveGroup($input: LeaveGroupInput!) {
  leaveGroup(input: $input) {
    ok
    error
  }
}
    `;
export type LeaveGroupMutationFn = Apollo.MutationFunction<LeaveGroupMutation, LeaveGroupMutationVariables>;

/**
 * __useLeaveGroupMutation__
 *
 * To run a mutation, you first call `useLeaveGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveGroupMutation, { data, loading, error }] = useLeaveGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLeaveGroupMutation(baseOptions?: Apollo.MutationHookOptions<LeaveGroupMutation, LeaveGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LeaveGroupMutation, LeaveGroupMutationVariables>(LeaveGroupDocument, options);
      }
export type LeaveGroupMutationHookResult = ReturnType<typeof useLeaveGroupMutation>;
export type LeaveGroupMutationResult = Apollo.MutationResult<LeaveGroupMutation>;
export type LeaveGroupMutationOptions = Apollo.BaseMutationOptions<LeaveGroupMutation, LeaveGroupMutationVariables>;
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
      therapist {
        id
        name
      }
      patient {
        id
        name
        gender
        registrationNumber
        birthday
      }
      lastModifier {
        id
        email
        name
      }
      group {
        id
        name
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
    groups {
      id
      staying
      manager
      accepted
      group {
        id
        name
        activate
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
export const SearchPatientByNameDocument = gql`
    query searchPatientByName($input: SearchPatientInput!) {
  searchPatientByName(input: $input) {
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
    }
  }
}
    `;

/**
 * __useSearchPatientByNameQuery__
 *
 * To run a query within a React component, call `useSearchPatientByNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchPatientByNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchPatientByNameQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSearchPatientByNameQuery(baseOptions: Apollo.QueryHookOptions<SearchPatientByNameQuery, SearchPatientByNameQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchPatientByNameQuery, SearchPatientByNameQueryVariables>(SearchPatientByNameDocument, options);
      }
export function useSearchPatientByNameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchPatientByNameQuery, SearchPatientByNameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchPatientByNameQuery, SearchPatientByNameQueryVariables>(SearchPatientByNameDocument, options);
        }
export type SearchPatientByNameQueryHookResult = ReturnType<typeof useSearchPatientByNameQuery>;
export type SearchPatientByNameLazyQueryHookResult = ReturnType<typeof useSearchPatientByNameLazyQuery>;
export type SearchPatientByNameQueryResult = Apollo.QueryResult<SearchPatientByNameQuery, SearchPatientByNameQueryVariables>;
export const FindPatientByIdDocument = gql`
    query findPatientById($input: FindPatientByIdInput!) {
  findPatientById(input: $input) {
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

/**
 * __useFindPatientByIdQuery__
 *
 * To run a query within a React component, call `useFindPatientByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindPatientByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindPatientByIdQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useFindPatientByIdQuery(baseOptions: Apollo.QueryHookOptions<FindPatientByIdQuery, FindPatientByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindPatientByIdQuery, FindPatientByIdQueryVariables>(FindPatientByIdDocument, options);
      }
export function useFindPatientByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindPatientByIdQuery, FindPatientByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindPatientByIdQuery, FindPatientByIdQueryVariables>(FindPatientByIdDocument, options);
        }
export type FindPatientByIdQueryHookResult = ReturnType<typeof useFindPatientByIdQuery>;
export type FindPatientByIdLazyQueryHookResult = ReturnType<typeof useFindPatientByIdLazyQuery>;
export type FindPatientByIdQueryResult = Apollo.QueryResult<FindPatientByIdQuery, FindPatientByIdQueryVariables>;
export const SearchUsersByNameDocument = gql`
    query searchUsersByName($input: SearchUsersByNameInput!) {
  searchUsersByName(input: $input) {
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
 * __useSearchUsersByNameQuery__
 *
 * To run a query within a React component, call `useSearchUsersByNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUsersByNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUsersByNameQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSearchUsersByNameQuery(baseOptions: Apollo.QueryHookOptions<SearchUsersByNameQuery, SearchUsersByNameQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchUsersByNameQuery, SearchUsersByNameQueryVariables>(SearchUsersByNameDocument, options);
      }
export function useSearchUsersByNameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchUsersByNameQuery, SearchUsersByNameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchUsersByNameQuery, SearchUsersByNameQueryVariables>(SearchUsersByNameDocument, options);
        }
export type SearchUsersByNameQueryHookResult = ReturnType<typeof useSearchUsersByNameQuery>;
export type SearchUsersByNameLazyQueryHookResult = ReturnType<typeof useSearchUsersByNameLazyQuery>;
export type SearchUsersByNameQueryResult = Apollo.QueryResult<SearchUsersByNameQuery, SearchUsersByNameQueryVariables>;
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