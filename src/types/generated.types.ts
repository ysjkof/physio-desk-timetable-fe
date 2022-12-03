export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
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

export type CancelInvitationInput = {
  id: Scalars['Int'];
  manager?: InputMaybe<Scalars['Boolean']>;
};

export type CheckAdminOutput = {
  __typename?: 'CheckAdminOutput';
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
  clinic?: Maybe<Clinic>;
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
  prescription?: Maybe<Prescription>;
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

export type EditPrescriptionInput = {
  activate?: InputMaybe<Scalars['Boolean']>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  name?: InputMaybe<Scalars['String']>;
};

export type EditPrescriptionOutput = {
  __typename?: 'EditPrescriptionOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type EditProfileInput = {
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

export type GetPatientInput = {
  id: Scalars['Int'];
};

export type GetPatientOutput = {
  __typename?: 'GetPatientOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  patient?: Maybe<Patient>;
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
  id: Scalars['Int'];
  page?: InputMaybe<Scalars['Int']>;
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

export type InviteUserInput = {
  clinicId: Scalars['Int'];
  name: Scalars['String'];
};

export type InviteUserOutput = {
  __typename?: 'InviteUserOutput';
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
  results: Array<Reservation>;
  totalCount: Scalars['Int'];
};

export type ListenDeleteReservationInput = {
  clinicId: Scalars['Int'];
};

export type ListenDeleteReservationOutput = {
  __typename?: 'ListenDeleteReservationOutput';
  clinicId: Scalars['Int'];
  id: Scalars['Int'];
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
  cancelInvitation: InviteUserOutput;
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
  editPrescription: EditPrescriptionOutput;
  editProfile: EditProfileOutput;
  editReservation: EditReservationOutput;
  inactivateClinic: InactivateClinicOutput;
  inviteUser: InviteUserOutput;
  leaveClinic: LeaveClinicOutput;
  login: LoginOutput;
  sendChangeEmail: SendChangeEmailOutput;
  verifyChangeEmail: VerifyChangeEmailOutput;
  verifyEmail: VerifyEmailOutput;
};


export type MutationAcceptInvitationArgs = {
  input: AcceptInvitationInput;
};


export type MutationCancelInvitationArgs = {
  input: CancelInvitationInput;
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


export type MutationEditPrescriptionArgs = {
  input: EditPrescriptionInput;
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


export type MutationInviteUserArgs = {
  input: InviteUserInput;
};


export type MutationLeaveClinicArgs = {
  input: LeaveClinicInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationSendChangeEmailArgs = {
  input: SendChangeEmailInput;
};


export type MutationVerifyChangeEmailArgs = {
  input: VerifyChangeEmailInput;
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
  clinic: Clinic;
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
  checkAdmin: CheckAdminOutput;
  findAllPatients: FindAllPatientsOutput;
  findAtomPrescriptions: FindAtomPrescriptionsOutput;
  findMyClinics: FindMyClinicsOutput;
  findPrescriptions: FindPrescriptionsOutput;
  getClinic: GetClinicOutput;
  getPatient: GetPatientOutput;
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


export type QueryCheckAdminArgs = {
  code: Scalars['String'];
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


export type QueryGetPatientArgs = {
  input: GetPatientInput;
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
  patient: Patient;
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
  clinicIds: Array<Scalars['Int']>;
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

export type SendChangeEmailInput = {
  email: Scalars['String'];
};

export type SendChangeEmailOutput = {
  __typename?: 'SendChangeEmailOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type Subscription = {
  __typename?: 'Subscription';
  listenDeleteReservation: ListenDeleteReservationOutput;
  listenUpdateReservation: Reservation;
};


export type SubscriptionListenDeleteReservationArgs = {
  input: ListenDeleteReservationInput;
};


export type SubscriptionListenUpdateReservationArgs = {
  input: UpdateReservationInput;
};

export type UpdateReservationInput = {
  clinicId: Scalars['Int'];
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

export type VerifyChangeEmailInput = {
  code: Scalars['String'];
  email: Scalars['String'];
};

export type VerifyChangeEmailOutput = {
  __typename?: 'VerifyChangeEmailOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type VerifyEmailInput = {
  code: Scalars['String'];
};

export type VerifyEmailOutput = {
  __typename?: 'VerifyEmailOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  user?: Maybe<User>;
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

export type CommonClinicFieldsFragment = { __typename?: 'Clinic', id: number, name: string, type: ClinicType, isActivated: boolean };

export type CommonMemberFieldsFragment = { __typename?: 'Member', id: number, accepted: boolean, manager: boolean, staying: boolean };

export type AcceptInvitationMutationVariables = Exact<{
  input: AcceptInvitationInput;
}>;


export type AcceptInvitationMutation = { __typename?: 'Mutation', acceptInvitation: { __typename?: 'AcceptInvitationOutput', ok: boolean, error?: string | null } };

export type CancelInvitationMutationVariables = Exact<{
  input: CancelInvitationInput;
}>;


export type CancelInvitationMutation = { __typename?: 'Mutation', cancelInvitation: { __typename?: 'InviteUserOutput', ok: boolean, error?: string | null } };

export type CreateClinicMutationVariables = Exact<{
  input: CreateClinicInput;
}>;


export type CreateClinicMutation = { __typename?: 'Mutation', createClinic: { __typename?: 'CreateClinicOutput', ok: boolean, error?: string | null, clinic?: { __typename?: 'Clinic', id: number, name: string, type: ClinicType, isActivated: boolean, members: Array<{ __typename?: 'Member', id: number, accepted: boolean, manager: boolean, staying: boolean, user: { __typename?: 'User', id: number, name: string } }> } | null } };

export type FindMyClinicsQueryVariables = Exact<{
  input: FindMyClinicsInput;
}>;


export type FindMyClinicsQuery = { __typename?: 'Query', findMyClinics: { __typename?: 'FindMyClinicsOutput', ok: boolean, error?: string | null, clinics?: Array<{ __typename?: 'Clinic', id: number, name: string, type: ClinicType, isActivated: boolean, members: Array<{ __typename?: 'Member', id: number, accepted: boolean, manager: boolean, staying: boolean, user: { __typename?: 'User', id: number, name: string }, clinic: { __typename?: 'Clinic', id: number, name: string } }> }> | null } };

export type GetClinicQueryVariables = Exact<{
  input: GetClinicInput;
}>;


export type GetClinicQuery = { __typename?: 'Query', getClinic: { __typename?: 'GetClinicOutput', ok: boolean, error?: string | null, clinic?: { __typename?: 'Clinic', id: number, name: string, members: Array<{ __typename?: 'Member', id: number, accepted: boolean, manager: boolean, staying: boolean, user: { __typename?: 'User', id: number, name: string, email: string } }> } | null } };

export type InactivateClinicMutationVariables = Exact<{
  input: InactivateClinicInput;
}>;


export type InactivateClinicMutation = { __typename?: 'Mutation', inactivateClinic: { __typename?: 'InactivateClinicOutput', ok: boolean, error?: string | null } };

export type InviteUserMutationVariables = Exact<{
  input: InviteUserInput;
}>;


export type InviteUserMutation = { __typename?: 'Mutation', inviteUser: { __typename?: 'InviteUserOutput', ok: boolean, error?: string | null } };

export type LeaveClinicMutationVariables = Exact<{
  input: LeaveClinicInput;
}>;


export type LeaveClinicMutation = { __typename?: 'Mutation', leaveClinic: { __typename?: 'LeaveClinicOutput', ok: boolean, error?: string | null } };

export type AllPatientFieldsFragment = { __typename?: 'Patient', id: number, registrationNumber: number, name: string, gender: string, birthday?: any | null, memo?: string | null };

export type CommonPatientFieldsFragment = { __typename?: 'Patient', id: number, registrationNumber: number, name: string, gender: string, birthday?: any | null };

export type CreatePatientMutationVariables = Exact<{
  input: CreatePatientInput;
}>;


export type CreatePatientMutation = { __typename?: 'Mutation', createPatient: { __typename?: 'CreatePatientOutput', ok: boolean, error?: string | null, patient?: { __typename?: 'Patient', id: number, registrationNumber: number, name: string, gender: string, birthday?: any | null, memo?: string | null, clinic: { __typename?: 'Clinic', id: number, name: string }, users: Array<{ __typename?: 'User', id: number, name: string }> } | null } };

export type FindAllPatientsQueryVariables = Exact<{
  input: FindAllPatientsInput;
}>;


export type FindAllPatientsQuery = { __typename?: 'Query', findAllPatients: { __typename?: 'FindAllPatientsOutput', ok: boolean, error?: string | null, totalPages?: number | null, totalCount?: number | null, results?: Array<{ __typename?: 'Patient', id: number, registrationNumber: number, name: string, gender: string, birthday?: any | null, clinic: { __typename?: 'Clinic', name: string } }> | null } };

export type GetPatientsQueryVariables = Exact<{
  input: GetPatientsInput;
}>;


export type GetPatientsQuery = { __typename?: 'Query', getPatients: { __typename?: 'GetPatientsOutput', ok: boolean, error?: string | null, patients: Array<{ __typename?: 'Patient', id: number, registrationNumber: number, name: string, gender: string, birthday?: any | null, memo?: string | null }> } };

export type SearchPatientQueryVariables = Exact<{
  input: SearchPatientInput;
}>;


export type SearchPatientQuery = { __typename?: 'Query', searchPatient: { __typename?: 'SearchPatientOutput', error?: string | null, ok: boolean, totalPages?: number | null, totalCount?: number | null, patients?: Array<{ __typename?: 'Patient', id: number, registrationNumber: number, name: string, gender: string, birthday?: any | null, clinic: { __typename?: 'Clinic', id: number, name: string }, users: Array<{ __typename?: 'User', id: number, name: string }> }> | null } };

export type AllPrescriptionFieldsFragment = { __typename?: 'Prescription', id: number, name: string, requiredTime: number, description?: string | null, price: number, activate?: boolean | null };

export type CommonPrescriptionFieldsFragment = { __typename?: 'Prescription', id: number, name: string, requiredTime: number, description?: string | null, price: number };

export type CreateAtomPrescriptionMutationVariables = Exact<{
  input: CreateAtomPrescriptionInput;
}>;


export type CreateAtomPrescriptionMutation = { __typename?: 'Mutation', createAtomPrescription: { __typename?: 'CreateAtomPrescriptionOutput', ok: boolean, error?: string | null } };

export type CreatePrescriptionMutationVariables = Exact<{
  input: CreatePrescriptionInput;
}>;


export type CreatePrescriptionMutation = { __typename?: 'Mutation', createPrescription: { __typename?: 'CreatePrescriptionOutput', ok: boolean, error?: string | null, prescription?: { __typename?: 'Prescription', id: number, name: string, requiredTime: number, description?: string | null, price: number, activate?: boolean | null, prescriptionAtoms?: Array<{ __typename?: 'PrescriptionAtom', id: number, name: string }> | null } | null } };

export type EditPrescriptionMutationVariables = Exact<{
  input: EditPrescriptionInput;
}>;


export type EditPrescriptionMutation = { __typename?: 'Mutation', editPrescription: { __typename?: 'EditPrescriptionOutput', ok: boolean, error?: string | null } };

export type FindAtomPrescriptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type FindAtomPrescriptionsQuery = { __typename?: 'Query', findAtomPrescriptions: { __typename?: 'FindAtomPrescriptionsOutput', ok: boolean, error?: string | null, results?: Array<{ __typename?: 'PrescriptionAtom', id: number, name: string }> | null } };

export type FindPrescriptionsQueryVariables = Exact<{
  input: FindPrescriptionsInput;
}>;


export type FindPrescriptionsQuery = { __typename?: 'Query', findPrescriptions: { __typename?: 'FindPrescriptionsOutput', ok: boolean, error?: string | null, prescriptions?: Array<{ __typename?: 'Prescription', id: number, name: string, requiredTime: number, description?: string | null, price: number, activate?: boolean | null, prescriptionAtoms?: Array<{ __typename?: 'PrescriptionAtom', id: number, name: string }> | null }> | null } };

export type CommonReservationFieldsFragment = { __typename?: 'Reservation', id: number, startDate: any, endDate: any, state: ReservationState, memo?: string | null, isFirst: boolean };

export type CreateDayOffMutationVariables = Exact<{
  input: CreateDayOffInput;
}>;


export type CreateDayOffMutation = { __typename?: 'Mutation', createDayOff: { __typename?: 'CreateDayOffOutput', ok: boolean, error?: string | null } };

export type CreateReservationMutationVariables = Exact<{
  input: CreateReservationInput;
}>;


export type CreateReservationMutation = { __typename?: 'Mutation', createReservation: { __typename?: 'CreateReservationOutput', ok: boolean, error?: string | null } };

export type DeleteReservationMutationVariables = Exact<{
  input: DeleteReservationInput;
}>;


export type DeleteReservationMutation = { __typename?: 'Mutation', deleteReservation: { __typename?: 'DeleteReservationOutput', error?: string | null, ok: boolean } };

export type EditReservationMutationVariables = Exact<{
  input: EditReservationInput;
}>;


export type EditReservationMutation = { __typename?: 'Mutation', editReservation: { __typename?: 'EditReservationOutput', ok: boolean, error?: string | null } };

export type GetReservationsByPatientQueryVariables = Exact<{
  input: GetReservationsByPatientInput;
}>;


export type GetReservationsByPatientQuery = { __typename?: 'Query', getReservationsByPatient: { __typename?: 'GetReservationsByPatientOutput', ok: boolean, error?: string | null, totalPages?: number | null, totalCount?: number | null, results?: Array<{ __typename?: 'Reservation', id: number, startDate: any, endDate: any, state: ReservationState, memo?: string | null, isFirst: boolean, prescriptions?: Array<{ __typename?: 'Prescription', name: string, requiredTime: number }> | null, user: { __typename?: 'User', id: number, name: string }, lastModifier: { __typename?: 'User', id: number, name: string } }> | null } };

export type GetStatisticsQueryVariables = Exact<{
  input: GetStatisticsInput;
}>;


export type GetStatisticsQuery = { __typename?: 'Query', getStatistics: { __typename?: 'GetStatisticsOutput', error?: string | null, ok: boolean, prescriptions?: Array<{ __typename?: 'Prescription', id: number, name: string, price: number, requiredTime: number }> | null, visitRates?: Array<{ __typename?: 'VisitRate', patientId: number, visited: Array<boolean> }> | null, dailyReports?: Array<{ __typename?: 'DailyReport', date: any, reservationCount: number, noshow: number, cancel: number, newPatient: number, users: Array<{ __typename?: 'UserInDailyReport', userId: number, reservationCount: number, noshow: number, cancel: number, newPatient: number, visitMoreThanThirty: number, visitMoreThanSixty: number, visitMoreThanNinety: number, prescriptions: Array<{ __typename?: 'getStatisticsOutputPrescription', id: number, name: string, count: number }>, reservations: Array<{ __typename?: 'Reservation', id: number, startDate: any, endDate: any, state: ReservationState, memo?: string | null, isFirst: boolean, prescriptions?: Array<{ __typename?: 'Prescription', id: number, name: string, price: number, requiredTime: number }> | null, patient: { __typename?: 'Patient', id: number, name: string }, lastModifier: { __typename?: 'User', id: number, name: string } }> }> }> | null } };

export type ListReservationsQueryVariables = Exact<{
  input: ListReservationsInput;
}>;


export type ListReservationsQuery = { __typename?: 'Query', listReservations: { __typename?: 'ListReservationsOutput', ok: boolean, totalCount: number, results: Array<{ __typename?: 'Reservation', id: number, startDate: any, endDate: any, state: ReservationState, memo?: string | null, isFirst: boolean, user: { __typename?: 'User', id: number, name: string }, patient: { __typename?: 'Patient', id: number, registrationNumber: number, name: string, gender: string, birthday?: any | null, memo?: string | null }, lastModifier: { __typename?: 'User', updatedAt?: any | null, id: number, name: string, email: string }, clinic: { __typename?: 'Clinic', id: number, name: string }, prescriptions?: Array<{ __typename?: 'Prescription', id: number, name: string, requiredTime: number, description?: string | null, price: number }> | null }> } };

export type ListenDeleteReservationSubscriptionVariables = Exact<{
  input: ListenDeleteReservationInput;
}>;


export type ListenDeleteReservationSubscription = { __typename?: 'Subscription', listenDeleteReservation: { __typename?: 'ListenDeleteReservationOutput', id: number, clinicId: number } };

export type ListenUpdateReservationSubscriptionVariables = Exact<{
  input: UpdateReservationInput;
}>;


export type ListenUpdateReservationSubscription = { __typename?: 'Subscription', listenUpdateReservation: { __typename?: 'Reservation', id: number, startDate: any, endDate: any, state: ReservationState, memo?: string | null, isFirst: boolean, user: { __typename?: 'User', id: number }, patient: { __typename?: 'Patient', id: number, name: string }, lastModifier: { __typename?: 'User', updatedAt?: any | null, id: number, name: string, email: string }, clinic: { __typename?: 'Clinic', id: number }, prescriptions?: Array<{ __typename?: 'Prescription', id: number }> | null } };

export type UserEmailAndVerifyFieldsFragment = { __typename?: 'User', email: string, verified: boolean };

export type UserIdNameEmailFieldsFragment = { __typename?: 'User', id: number, name: string, email: string };

export type CheckAdminQueryVariables = Exact<{
  code: Scalars['String'];
}>;


export type CheckAdminQuery = { __typename?: 'Query', checkAdmin: { __typename?: 'CheckAdminOutput', ok: boolean, error?: string | null } };

export type CreateAccountMutationVariables = Exact<{
  input: CreateAccountInput;
}>;


export type CreateAccountMutation = { __typename?: 'Mutation', createAccount: { __typename?: 'CreateAccountOutput', ok: boolean, error?: string | null } };

export type EditProfileMutationVariables = Exact<{
  input: EditProfileInput;
}>;


export type EditProfileMutation = { __typename?: 'Mutation', editProfile: { __typename?: 'EditProfileOutput', ok: boolean, error?: string | null } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginOutput', ok: boolean, error?: string | null, token?: string | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: number, name: string, email: string, role: UserRole, verified: boolean, members?: Array<{ __typename?: 'Member', id: number, accepted: boolean, manager: boolean, staying: boolean, clinic: { __typename?: 'Clinic', id: number, name: string, type: ClinicType, isActivated: boolean } }> | null, notice?: Array<{ __typename?: 'Notice', message: string, read: boolean }> | null } };

export type SearchUsersQueryVariables = Exact<{
  input: SearchUsersInput;
}>;


export type SearchUsersQuery = { __typename?: 'Query', searchUsers: { __typename?: 'SearchUsersOutput', ok: boolean, error?: string | null, totalCount?: number | null, results?: Array<{ __typename?: 'User', id: number, name: string, email: string }> | null } };

export type SendChangeEmailMutationVariables = Exact<{
  input: SendChangeEmailInput;
}>;


export type SendChangeEmailMutation = { __typename?: 'Mutation', sendChangeEmail: { __typename?: 'SendChangeEmailOutput', ok: boolean, error?: string | null } };

export type VerifyChangeEmailMutationVariables = Exact<{
  input: VerifyChangeEmailInput;
}>;


export type VerifyChangeEmailMutation = { __typename?: 'Mutation', verifyChangeEmail: { __typename?: 'VerifyChangeEmailOutput', ok: boolean, error?: string | null } };

export type VerifyEmailMutationVariables = Exact<{
  input: VerifyEmailInput;
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail: { __typename?: 'VerifyEmailOutput', ok: boolean, error?: string | null } };
