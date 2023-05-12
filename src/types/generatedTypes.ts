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
  memberId: Scalars['Int'];
};

export type AcceptInvitationOutput = {
  __typename?: 'AcceptInvitationOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
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
  isActive: Scalars['Boolean'];
  members: Array<Member>;
  name: Scalars['String'];
  patient?: Maybe<Array<Patient>>;
  phone?: Maybe<Scalars['String']>;
  prescriptions: Array<Prescription>;
  reservations?: Maybe<Array<Reservation>>;
  type: ClinicType;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export enum ClinicType {
  Group = 'Group',
  Personal = 'Personal'
}

export type Color = {
  __typename?: 'Color';
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['Float'];
  members: Array<Member>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  value: Scalars['String'];
};

export type CreateAccountInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  nickname: Scalars['String'];
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
  isPersonal?: Scalars['Boolean'];
  name: Scalars['String'];
  phone?: InputMaybe<Scalars['String']>;
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

export type CreateNewVerificationInput = {
  email: Scalars['String'];
};

export type CreateNewVerificationOutput = {
  __typename?: 'CreateNewVerificationOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type CreatePatientInput = {
  birthday?: InputMaybe<Scalars['DateTime']>;
  clinicId?: InputMaybe<Scalars['Int']>;
  gender?: InputMaybe<Scalars['String']>;
  memo?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
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

export type DeactivateClinicInput = {
  clinicId: Scalars['Int'];
};

export type DeactivateClinicOutput = {
  __typename?: 'DeactivateClinicOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
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

export type GetAllPatientsByClinicInput = {
  id: Scalars['Int'];
  page?: Scalars['Int'];
};

export type GetAllPatientsByClinicOutput = {
  __typename?: 'GetAllPatientsByClinicOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  results?: Maybe<Array<Patient>>;
  totalCount?: Maybe<Scalars['Int']>;
  totalPages?: Maybe<Scalars['Int']>;
};

export type GetAtomPrescriptionsOutput = {
  __typename?: 'GetAtomPrescriptionsOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  results?: Maybe<Array<PrescriptionAtom>>;
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

export type GetMemberInput = {
  clinicId: Scalars['Int'];
  id: Scalars['Int'];
};

export type GetMemberOutput = {
  __typename?: 'GetMemberOutput';
  countOfPatient?: Maybe<Scalars['Int']>;
  error?: Maybe<Scalars['String']>;
  member?: Maybe<Member>;
  ok: Scalars['Boolean'];
};

export type GetMyClinicsStatusOutput = {
  __typename?: 'GetMyClinicsStatusOutput';
  clinics?: Maybe<Array<MemberStatus>>;
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type GetPatientByInput = {
  clinicIds: Array<Scalars['Int']>;
  page?: Scalars['Int'];
  query: Scalars['String'];
};

export type GetPatientByOutput = {
  __typename?: 'GetPatientByOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  patients?: Maybe<Array<Patient>>;
  totalCount?: Maybe<Scalars['Int']>;
  totalPages?: Maybe<Scalars['Int']>;
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

export type GetPrescriptionByIdInput = {
  id: Scalars['Int'];
};

export type GetPrescriptionByIdOutput = {
  __typename?: 'GetPrescriptionByIdOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  prescription?: Maybe<Prescription>;
};

export type GetPrescriptionsByClinicInput = {
  hasActive?: InputMaybe<Scalars['Boolean']>;
  hasInactive?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['Int'];
};

export type GetPrescriptionsByClinicOutput = {
  __typename?: 'GetPrescriptionsByClinicOutput';
  count: Scalars['Int'];
  error?: Maybe<Scalars['String']>;
  maximumCount: Scalars['Int'];
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

export type GetReservationsByIntervalInput = {
  clinicId: Scalars['Int'];
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
};

export type GetReservationsByIntervalOutput = {
  __typename?: 'GetReservationsByIntervalOutput';
  error?: Maybe<Scalars['String']>;
  members?: Maybe<Array<Member>>;
  ok: Scalars['Boolean'];
  results?: Maybe<Array<Reservation>>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type GetReservationsByMemberInput = {
  clinicId: Scalars['Int'];
  endDate: Scalars['DateTime'];
  memberId: Scalars['Int'];
  page?: Scalars['Int'];
  startDate: Scalars['DateTime'];
};

export type GetReservationsByMemberOutput = {
  __typename?: 'GetReservationsByMemberOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  results?: Maybe<Array<Reservation>>;
  totalCount?: Maybe<Scalars['Int']>;
  totalPages?: Maybe<Scalars['Int']>;
};

export type GetReservationsByPatientInput = {
  id: Scalars['Int'];
  page?: Scalars['Int'];
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

export type GetUsersByNameInput = {
  name: Scalars['String'];
};

export type GetUsersByNameOutput = {
  __typename?: 'GetUsersByNameOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  results?: Maybe<Array<User>>;
  totalCount?: Maybe<Scalars['Int']>;
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
  memberId: Scalars['Int'];
};

export type LeaveClinicOutput = {
  __typename?: 'LeaveClinicOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type ListenCreateReservationInput = {
  clinicId: Scalars['Int'];
};

export type ListenDeleteReservationInput = {
  clinicId: Scalars['Int'];
};

export type ListenDeleteReservationOutput = {
  __typename?: 'ListenDeleteReservationOutput';
  clinicId: Scalars['Int'];
  id: Scalars['Int'];
};

export type ListenUpdateReservationInput = {
  clinicId: Scalars['Int'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type LoginOutput = {
  __typename?: 'LoginOutput';
  authRequired?: Maybe<Scalars['Boolean']>;
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  token?: Maybe<Scalars['String']>;
};

export type Member = {
  __typename?: 'Member';
  accepted: Scalars['Boolean'];
  clinic: Clinic;
  color?: Maybe<Color>;
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['Float'];
  manager: Scalars['Boolean'];
  staying: Scalars['Boolean'];
  updatedAt?: Maybe<Scalars['DateTime']>;
  user: User;
};

export type MemberStatus = {
  __typename?: 'MemberStatus';
  accepted: Scalars['Boolean'];
  id: Scalars['Int'];
  isPersonal: Scalars['Boolean'];
  manager: Scalars['Boolean'];
  name: Scalars['String'];
  staying: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvitation: AcceptInvitationOutput;
  createAccount: CreateAccountOutput;
  createAtomPrescription: CreateAtomPrescriptionOutput;
  createClinic: CreateClinicOutput;
  createDayOff: CreateDayOffOutput;
  createNewVerification: CreateNewVerificationOutput;
  createPatient: CreatePatientOutput;
  createPrescription: CreatePrescriptionOutput;
  createReservation: CreateReservationOutput;
  deactivateClinic: DeactivateClinicOutput;
  deletePatient: DeletePatientOutput;
  deleteReservation: DeleteReservationOutput;
  inviteUser: InviteUserOutput;
  leaveClinic: LeaveClinicOutput;
  login: LoginOutput;
  refuseInvitation: InviteUserOutput;
  sendChangeEmail: SendChangeEmailOutput;
  sendMessage: SendMessageOutput;
  updateMemberColor: UpdateMemberColorOutput;
  updatePatient: UpdatePatientOutput;
  updatePrescription: UpdatePrescriptionOutput;
  updateProfile: UpdateProfileOutput;
  updateReservation: UpdateReservationOutput;
  verifyChangeEmail: VerifyChangeEmailOutput;
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


export type MutationCreateNewVerificationArgs = {
  input: CreateNewVerificationInput;
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


export type MutationDeactivateClinicArgs = {
  input: DeactivateClinicInput;
};


export type MutationDeletePatientArgs = {
  input: DeletePatientInput;
};


export type MutationDeleteReservationArgs = {
  input: DeleteReservationInput;
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


export type MutationRefuseInvitationArgs = {
  input: RefuseInvitationInput;
};


export type MutationSendChangeEmailArgs = {
  input: SendChangeEmailInput;
};


export type MutationSendMessageArgs = {
  input: SendMessageInput;
};


export type MutationUpdateMemberColorArgs = {
  input: UpdateMemberColorInput;
};


export type MutationUpdatePatientArgs = {
  input: UpdatePatientInput;
};


export type MutationUpdatePrescriptionArgs = {
  input: UpdatePrescriptionInput;
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUpdateReservationArgs = {
  input: UpdateReservationInput;
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
  phone?: Maybe<Scalars['String']>;
  registrationNumber: Scalars['Int'];
  reservations: Array<Reservation>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  users?: Maybe<Array<User>>;
};

export type Prescription = {
  __typename?: 'Prescription';
  createdAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['Float'];
  isActive?: Maybe<Scalars['Boolean']>;
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
  getAllPatientsByClinic: GetAllPatientsByClinicOutput;
  getAtomPrescriptions: GetAtomPrescriptionsOutput;
  getClinic: GetClinicOutput;
  getMember: GetMemberOutput;
  getMyClinicsStatus: GetMyClinicsStatusOutput;
  getMyMembers: GetMyMembersOutput;
  getPatient: GetPatientOutput;
  getPatientBy: GetPatientByOutput;
  getPatients: GetPatientsOutput;
  getPrescriptionById: GetPrescriptionByIdOutput;
  getPrescriptionsByClinic: GetPrescriptionsByClinicOutput;
  getReservation: GetReservationOutput;
  getReservationsByInterval: GetReservationsByIntervalOutput;
  getReservationsByMember: GetReservationsByMemberOutput;
  getReservationsByPatient: GetReservationsByPatientOutput;
  getStatistics: GetStatisticsOutput;
  getUsersByName: GetUsersByNameOutput;
  me: User;
  userProfile: GetUserOutput;
};


export type QueryCheckAdminArgs = {
  code: Scalars['String'];
};


export type QueryGetAllPatientsByClinicArgs = {
  input: GetAllPatientsByClinicInput;
};


export type QueryGetClinicArgs = {
  input: GetClinicInput;
};


export type QueryGetMemberArgs = {
  input: GetMemberInput;
};


export type QueryGetPatientArgs = {
  input: GetPatientInput;
};


export type QueryGetPatientByArgs = {
  input: GetPatientByInput;
};


export type QueryGetPatientsArgs = {
  input: GetPatientsInput;
};


export type QueryGetPrescriptionByIdArgs = {
  input: GetPrescriptionByIdInput;
};


export type QueryGetPrescriptionsByClinicArgs = {
  input: GetPrescriptionsByClinicInput;
};


export type QueryGetReservationArgs = {
  input: GetReservationInput;
};


export type QueryGetReservationsByIntervalArgs = {
  input: GetReservationsByIntervalInput;
};


export type QueryGetReservationsByMemberArgs = {
  input: GetReservationsByMemberInput;
};


export type QueryGetReservationsByPatientArgs = {
  input: GetReservationsByPatientInput;
};


export type QueryGetStatisticsArgs = {
  input: GetStatisticsInput;
};


export type QueryGetUsersByNameArgs = {
  input: GetUsersByNameInput;
};


export type QueryUserProfileArgs = {
  id: Scalars['Float'];
};

export type RefuseInvitationInput = {
  memberId: Scalars['Int'];
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

export type SendChangeEmailInput = {
  email: Scalars['String'];
};

export type SendChangeEmailOutput = {
  __typename?: 'SendChangeEmailOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type SendMessageInput = {
  content: Scalars['String'];
  to: Scalars['String'];
};

export type SendMessageOutput = {
  __typename?: 'SendMessageOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type Subscription = {
  __typename?: 'Subscription';
  listenCreateReservation: Reservation;
  listenDeleteReservation: ListenDeleteReservationOutput;
  listenUpdateReservation: Reservation;
};


export type SubscriptionListenCreateReservationArgs = {
  input: ListenCreateReservationInput;
};


export type SubscriptionListenDeleteReservationArgs = {
  input: ListenDeleteReservationInput;
};


export type SubscriptionListenUpdateReservationArgs = {
  input: ListenUpdateReservationInput;
};

export type UpdateMemberColorInput = {
  id: Scalars['Int'];
  value: Scalars['String'];
};

export type UpdateMemberColorOutput = {
  __typename?: 'UpdateMemberColorOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type UpdatePatientInput = {
  birthday?: InputMaybe<Scalars['DateTime']>;
  clinicId?: InputMaybe<Scalars['Int']>;
  gender?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  memo?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
};

export type UpdatePatientOutput = {
  __typename?: 'UpdatePatientOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type UpdatePrescriptionInput = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  isActive?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
};

export type UpdatePrescriptionOutput = {
  __typename?: 'UpdatePrescriptionOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type UpdateProfileInput = {
  currentPassword?: InputMaybe<Scalars['String']>;
  newPassword?: InputMaybe<Scalars['String']>;
  nickname?: InputMaybe<Scalars['String']>;
};

export type UpdateProfileOutput = {
  __typename?: 'UpdateProfileOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type UpdateReservationInput = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  memo?: InputMaybe<Scalars['String']>;
  prescriptionIds?: InputMaybe<Array<Scalars['Float']>>;
  reservationId: Scalars['Int'];
  startDate?: InputMaybe<Scalars['DateTime']>;
  state?: InputMaybe<ReservationState>;
  userId?: InputMaybe<Scalars['Int']>;
};

export type UpdateReservationOutput = {
  __typename?: 'UpdateReservationOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type User = {
  __typename?: 'User';
  createdAt?: Maybe<Scalars['DateTime']>;
  email: Scalars['String'];
  id: Scalars['Float'];
  members?: Maybe<Array<Member>>;
  name: Scalars['String'];
  nickname: Scalars['String'];
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

export type GetMyMembersOutput = {
  __typename?: 'getMyMembersOutput';
  error?: Maybe<Scalars['String']>;
  members: Array<Member>;
  ok: Scalars['Boolean'];
};

export type GetStatisticsOutputPrescription = {
  __typename?: 'getStatisticsOutputPrescription';
  count: Scalars['Int'];
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type CommonClinicFieldsFragment = { __typename?: 'Clinic', id: number, name: string, type: ClinicType, isActive: boolean };

export type CommonMemberFieldsFragment = { __typename?: 'Member', id: number, accepted: boolean, manager: boolean, staying: boolean };

export type AcceptInvitationMutationVariables = Exact<{
  input: AcceptInvitationInput;
}>;


export type AcceptInvitationMutation = { __typename?: 'Mutation', acceptInvitation: { __typename?: 'AcceptInvitationOutput', ok: boolean, error?: string | null } };

export type CreateClinicMutationVariables = Exact<{
  input: CreateClinicInput;
}>;


export type CreateClinicMutation = { __typename?: 'Mutation', createClinic: { __typename?: 'CreateClinicOutput', ok: boolean, error?: string | null, clinic?: { __typename?: 'Clinic', id: number, name: string, type: ClinicType, isActive: boolean, members: Array<{ __typename?: 'Member', createdAt?: any | null, id: number, accepted: boolean, manager: boolean, staying: boolean, user: { __typename?: 'User', id: number, name: string, nickname: string, email: string } }> } | null } };

export type DeactivateClinicMutationVariables = Exact<{
  input: DeactivateClinicInput;
}>;


export type DeactivateClinicMutation = { __typename?: 'Mutation', deactivateClinic: { __typename?: 'DeactivateClinicOutput', ok: boolean, error?: string | null } };

export type GetClinicQueryVariables = Exact<{
  input: GetClinicInput;
}>;


export type GetClinicQuery = { __typename?: 'Query', getClinic: { __typename?: 'GetClinicOutput', ok: boolean, error?: string | null, clinic?: { __typename?: 'Clinic', id: number, name: string, type: ClinicType, isActive: boolean, phone?: string | null, members: Array<{ __typename?: 'Member', createdAt?: any | null, updatedAt?: any | null, id: number, accepted: boolean, manager: boolean, staying: boolean, color?: { __typename?: 'Color', value: string } | null, user: { __typename?: 'User', id: number, name: string, nickname: string, email: string } }> } | null } };

export type GetMemberQueryVariables = Exact<{
  input: GetMemberInput;
}>;


export type GetMemberQuery = { __typename?: 'Query', getMember: { __typename?: 'GetMemberOutput', ok: boolean, error?: string | null, countOfPatient?: number | null, member?: { __typename?: 'Member', id: number, accepted: boolean, manager: boolean, staying: boolean, color?: { __typename?: 'Color', value: string } | null, user: { __typename?: 'User', role: UserRole, id: number, name: string, nickname: string, email: string } } | null } };

export type GetMyClinicsStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyClinicsStatusQuery = { __typename?: 'Query', getMyClinicsStatus: { __typename?: 'GetMyClinicsStatusOutput', ok: boolean, error?: string | null, clinics?: Array<{ __typename?: 'MemberStatus', id: number, name: string, accepted: boolean, staying: boolean, manager: boolean, isPersonal: boolean }> | null } };

export type GetMyMembersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyMembersQuery = { __typename?: 'Query', getMyMembers: { __typename?: 'getMyMembersOutput', ok: boolean, error?: string | null, members: Array<{ __typename?: 'Member', id: number, manager: boolean, accepted: boolean, staying: boolean, createdAt?: any | null, clinic: { __typename?: 'Clinic', id: number, name: string, isActive: boolean } }> } };

export type InviteUserMutationVariables = Exact<{
  input: InviteUserInput;
}>;


export type InviteUserMutation = { __typename?: 'Mutation', inviteUser: { __typename?: 'InviteUserOutput', ok: boolean, error?: string | null } };

export type LeaveClinicMutationVariables = Exact<{
  input: LeaveClinicInput;
}>;


export type LeaveClinicMutation = { __typename?: 'Mutation', leaveClinic: { __typename?: 'LeaveClinicOutput', ok: boolean, error?: string | null } };

export type RefuseInvitationMutationVariables = Exact<{
  input: RefuseInvitationInput;
}>;


export type RefuseInvitationMutation = { __typename?: 'Mutation', refuseInvitation: { __typename?: 'InviteUserOutput', ok: boolean, error?: string | null } };

export type UpdateMemberColorMutationVariables = Exact<{
  input: UpdateMemberColorInput;
}>;


export type UpdateMemberColorMutation = { __typename?: 'Mutation', updateMemberColor: { __typename?: 'UpdateMemberColorOutput', ok: boolean, error?: string | null } };

export type SendMessageMutationVariables = Exact<{
  input: SendMessageInput;
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'SendMessageOutput', ok: boolean, error?: string | null } };

export type AllPatientFieldsFragment = { __typename?: 'Patient', id: number, registrationNumber: number, name: string, gender: string, birthday?: any | null, memo?: string | null };

export type CommonPatientFieldsFragment = { __typename?: 'Patient', id: number, registrationNumber: number, name: string, gender: string, birthday?: any | null, phone?: string | null };

export type CreatePatientMutationVariables = Exact<{
  input: CreatePatientInput;
}>;


export type CreatePatientMutation = { __typename?: 'Mutation', createPatient: { __typename?: 'CreatePatientOutput', ok: boolean, error?: string | null, patient?: { __typename?: 'Patient', id: number, registrationNumber: number, name: string, gender: string, birthday?: any | null, memo?: string | null, users?: Array<{ __typename?: 'User', id: number, name: string }> | null } | null } };

export type GetAllPatientsByClinicQueryVariables = Exact<{
  input: GetAllPatientsByClinicInput;
}>;


export type GetAllPatientsByClinicQuery = { __typename?: 'Query', getAllPatientsByClinic: { __typename?: 'GetAllPatientsByClinicOutput', ok: boolean, error?: string | null, totalPages?: number | null, totalCount?: number | null, results?: Array<{ __typename?: 'Patient', id: number, registrationNumber: number, name: string, gender: string, birthday?: any | null, phone?: string | null, clinic: { __typename?: 'Clinic', name: string } }> | null } };

export type GetPatientByQueryVariables = Exact<{
  input: GetPatientByInput;
}>;


export type GetPatientByQuery = { __typename?: 'Query', getPatientBy: { __typename?: 'GetPatientByOutput', error?: string | null, ok: boolean, totalPages?: number | null, totalCount?: number | null, patients?: Array<{ __typename?: 'Patient', id: number, registrationNumber: number, name: string, gender: string, birthday?: any | null, phone?: string | null, clinic: { __typename?: 'Clinic', id: number, name: string }, users?: Array<{ __typename?: 'User', id: number, name: string }> | null }> | null } };

export type GetPatientsQueryVariables = Exact<{
  input: GetPatientsInput;
}>;


export type GetPatientsQuery = { __typename?: 'Query', getPatients: { __typename?: 'GetPatientsOutput', ok: boolean, error?: string | null, patients: Array<{ __typename?: 'Patient', id: number, registrationNumber: number, name: string, gender: string, birthday?: any | null, memo?: string | null }> } };

export type UpdatePatientMutationVariables = Exact<{
  input: UpdatePatientInput;
}>;


export type UpdatePatientMutation = { __typename?: 'Mutation', updatePatient: { __typename?: 'UpdatePatientOutput', ok: boolean, error?: string | null } };

export type AllPrescriptionFieldsFragment = { __typename?: 'Prescription', id: number, name: string, requiredTime: number, description?: string | null, price: number, isActive?: boolean | null };

export type CommonPrescriptionFieldsFragment = { __typename?: 'Prescription', id: number, name: string, requiredTime: number, description?: string | null, price: number };

export type CreateAtomPrescriptionMutationVariables = Exact<{
  input: CreateAtomPrescriptionInput;
}>;


export type CreateAtomPrescriptionMutation = { __typename?: 'Mutation', createAtomPrescription: { __typename?: 'CreateAtomPrescriptionOutput', ok: boolean, error?: string | null } };

export type CreatePrescriptionMutationVariables = Exact<{
  input: CreatePrescriptionInput;
}>;


export type CreatePrescriptionMutation = { __typename?: 'Mutation', createPrescription: { __typename?: 'CreatePrescriptionOutput', ok: boolean, error?: string | null, prescription?: { __typename?: 'Prescription', id: number, name: string, requiredTime: number, description?: string | null, price: number, isActive?: boolean | null, prescriptionAtoms?: Array<{ __typename?: 'PrescriptionAtom', id: number, name: string }> | null } | null } };

export type GetAtomPrescriptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAtomPrescriptionsQuery = { __typename?: 'Query', getAtomPrescriptions: { __typename?: 'GetAtomPrescriptionsOutput', ok: boolean, error?: string | null, results?: Array<{ __typename?: 'PrescriptionAtom', id: number, name: string }> | null } };

export type GetPrescriptionByIdQueryVariables = Exact<{
  input: GetPrescriptionByIdInput;
}>;


export type GetPrescriptionByIdQuery = { __typename?: 'Query', getPrescriptionById: { __typename?: 'GetPrescriptionByIdOutput', ok: boolean, error?: string | null, prescription?: { __typename?: 'Prescription', id: number, name: string, description?: string | null } | null } };

export type GetPrescriptionsByClinicQueryVariables = Exact<{
  input: GetPrescriptionsByClinicInput;
}>;


export type GetPrescriptionsByClinicQuery = { __typename?: 'Query', getPrescriptionsByClinic: { __typename?: 'GetPrescriptionsByClinicOutput', ok: boolean, error?: string | null, count: number, maximumCount: number, prescriptions?: Array<{ __typename?: 'Prescription', id: number, name: string, requiredTime: number, description?: string | null, price: number, isActive?: boolean | null, prescriptionAtoms?: Array<{ __typename?: 'PrescriptionAtom', id: number, name: string }> | null }> | null } };

export type UpdatePrescriptionMutationVariables = Exact<{
  input: UpdatePrescriptionInput;
}>;


export type UpdatePrescriptionMutation = { __typename?: 'Mutation', updatePrescription: { __typename?: 'UpdatePrescriptionOutput', ok: boolean, error?: string | null } };

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

export type GetReservationsByIntervalQueryVariables = Exact<{
  input: GetReservationsByIntervalInput;
}>;


export type GetReservationsByIntervalQuery = { __typename?: 'Query', getReservationsByInterval: { __typename?: 'GetReservationsByIntervalOutput', ok: boolean, error?: string | null, totalCount?: number | null, members?: Array<{ __typename?: 'Member', id: number, accepted: boolean, staying: boolean, manager: boolean, updatedAt?: any | null, createdAt?: any | null, color?: { __typename?: 'Color', value: string } | null, user: { __typename?: 'User', id: number, name: string } }> | null, results?: Array<{ __typename?: 'Reservation', id: number, startDate: any, endDate: any, state: ReservationState, memo?: string | null, isFirst: boolean, user: { __typename?: 'User', id: number, name: string }, patient?: { __typename?: 'Patient', id: number, registrationNumber: number, name: string, gender: string, birthday?: any | null, memo?: string | null } | null, lastModifier: { __typename?: 'User', updatedAt?: any | null, id: number, name: string, nickname: string, email: string }, clinic: { __typename?: 'Clinic', id: number, name: string }, prescriptions?: Array<{ __typename?: 'Prescription', id: number, name: string, requiredTime: number, description?: string | null, price: number }> | null }> | null } };

export type GetReservationsByMemberQueryVariables = Exact<{
  input: GetReservationsByMemberInput;
}>;


export type GetReservationsByMemberQuery = { __typename?: 'Query', getReservationsByMember: { __typename?: 'GetReservationsByMemberOutput', ok: boolean, error?: string | null, totalPages?: number | null, totalCount?: number | null, results?: Array<{ __typename?: 'Reservation', id: number, startDate: any, endDate: any, state: ReservationState, memo?: string | null, isFirst: boolean, prescriptions?: Array<{ __typename?: 'Prescription', name: string, requiredTime: number }> | null, user: { __typename?: 'User', id: number, name: string }, patient?: { __typename?: 'Patient', id: number, registrationNumber: number, name: string, gender: string, birthday?: any | null, phone?: string | null } | null, lastModifier: { __typename?: 'User', id: number, name: string } }> | null } };

export type GetReservationsByPatientQueryVariables = Exact<{
  input: GetReservationsByPatientInput;
}>;


export type GetReservationsByPatientQuery = { __typename?: 'Query', getReservationsByPatient: { __typename?: 'GetReservationsByPatientOutput', ok: boolean, error?: string | null, totalPages?: number | null, totalCount?: number | null, results?: Array<{ __typename?: 'Reservation', id: number, startDate: any, endDate: any, state: ReservationState, memo?: string | null, isFirst: boolean, prescriptions?: Array<{ __typename?: 'Prescription', name: string, requiredTime: number }> | null, user: { __typename?: 'User', id: number, name: string }, lastModifier: { __typename?: 'User', id: number, name: string } }> | null } };

export type GetStatisticsQueryVariables = Exact<{
  input: GetStatisticsInput;
}>;


export type GetStatisticsQuery = { __typename?: 'Query', getStatistics: { __typename?: 'GetStatisticsOutput', error?: string | null, ok: boolean, prescriptions?: Array<{ __typename?: 'Prescription', id: number, name: string, price: number, requiredTime: number }> | null, visitRates?: Array<{ __typename?: 'VisitRate', patientId: number, visited: Array<boolean> }> | null, dailyReports?: Array<{ __typename?: 'DailyReport', date: any, reservationCount: number, noshow: number, cancel: number, newPatient: number, users: Array<{ __typename?: 'UserInDailyReport', userId: number, reservationCount: number, noshow: number, cancel: number, newPatient: number, visitMoreThanThirty: number, visitMoreThanSixty: number, visitMoreThanNinety: number, prescriptions: Array<{ __typename?: 'getStatisticsOutputPrescription', id: number, name: string, count: number }>, reservations: Array<{ __typename?: 'Reservation', id: number, startDate: any, endDate: any, state: ReservationState, memo?: string | null, isFirst: boolean, prescriptions?: Array<{ __typename?: 'Prescription', id: number, name: string, price: number, requiredTime: number }> | null, patient?: { __typename?: 'Patient', id: number, name: string } | null, lastModifier: { __typename?: 'User', id: number, name: string } }> }> }> | null } };

export type UpdateReservationMutationVariables = Exact<{
  input: UpdateReservationInput;
}>;


export type UpdateReservationMutation = { __typename?: 'Mutation', updateReservation: { __typename?: 'UpdateReservationOutput', ok: boolean, error?: string | null } };

export type ListenCreateReservationSubscriptionVariables = Exact<{
  input: ListenCreateReservationInput;
}>;


export type ListenCreateReservationSubscription = { __typename?: 'Subscription', listenCreateReservation: { __typename?: 'Reservation', id: number, startDate: any, endDate: any, state: ReservationState, memo?: string | null, isFirst: boolean, user: { __typename?: 'User', id: number, name: string }, patient?: { __typename?: 'Patient', id: number, registrationNumber: number, name: string, gender: string, birthday?: any | null, memo?: string | null } | null, lastModifier: { __typename?: 'User', updatedAt?: any | null, id: number, name: string, nickname: string, email: string }, clinic: { __typename?: 'Clinic', id: number, name: string }, prescriptions?: Array<{ __typename?: 'Prescription', id: number, name: string, requiredTime: number, description?: string | null, price: number }> | null } };

export type ListenDeleteReservationSubscriptionVariables = Exact<{
  input: ListenDeleteReservationInput;
}>;


export type ListenDeleteReservationSubscription = { __typename?: 'Subscription', listenDeleteReservation: { __typename?: 'ListenDeleteReservationOutput', id: number, clinicId: number } };

export type ListenUpdateReservationSubscriptionVariables = Exact<{
  input: ListenUpdateReservationInput;
}>;


export type ListenUpdateReservationSubscription = { __typename?: 'Subscription', listenUpdateReservation: { __typename?: 'Reservation', id: number, startDate: any, endDate: any, state: ReservationState, memo?: string | null, isFirst: boolean, user: { __typename?: 'User', id: number }, patient?: { __typename?: 'Patient', id: number, name: string } | null, lastModifier: { __typename?: 'User', updatedAt?: any | null, id: number, name: string, nickname: string, email: string }, clinic: { __typename?: 'Clinic', id: number }, prescriptions?: Array<{ __typename?: 'Prescription', id: number }> | null } };

export type UserEmailAndVerifyFieldsFragment = { __typename?: 'User', email: string, verified: boolean };

export type UserIdNameNicknameEmailFieldsFragment = { __typename?: 'User', id: number, name: string, nickname: string, email: string };

export type CheckAdminQueryVariables = Exact<{
  code: Scalars['String'];
}>;


export type CheckAdminQuery = { __typename?: 'Query', checkAdmin: { __typename?: 'CheckAdminOutput', ok: boolean, error?: string | null } };

export type CreateAccountMutationVariables = Exact<{
  input: CreateAccountInput;
}>;


export type CreateAccountMutation = { __typename?: 'Mutation', createAccount: { __typename?: 'CreateAccountOutput', ok: boolean, error?: string | null } };

export type CreateNewVerificationMutationVariables = Exact<{
  input: CreateNewVerificationInput;
}>;


export type CreateNewVerificationMutation = { __typename?: 'Mutation', createNewVerification: { __typename?: 'CreateNewVerificationOutput', ok: boolean, error?: string | null } };

export type GetUsersByNameQueryVariables = Exact<{
  input: GetUsersByNameInput;
}>;


export type GetUsersByNameQuery = { __typename?: 'Query', getUsersByName: { __typename?: 'GetUsersByNameOutput', ok: boolean, error?: string | null, totalCount?: number | null, results?: Array<{ __typename?: 'User', id: number, name: string, nickname: string, email: string }> | null } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginOutput', ok: boolean, error?: string | null, token?: string | null, authRequired?: boolean | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', role: UserRole, verified: boolean, id: number, name: string, nickname: string, email: string, members?: Array<{ __typename?: 'Member', id: number, accepted: boolean, manager: boolean, staying: boolean, clinic: { __typename?: 'Clinic', id: number, name: string, type: ClinicType, isActive: boolean } }> | null, notice?: Array<{ __typename?: 'Notice', message: string, read: boolean }> | null } };

export type SendChangeEmailMutationVariables = Exact<{
  input: SendChangeEmailInput;
}>;


export type SendChangeEmailMutation = { __typename?: 'Mutation', sendChangeEmail: { __typename?: 'SendChangeEmailOutput', ok: boolean, error?: string | null } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'UpdateProfileOutput', ok: boolean, error?: string | null } };

export type VerifyChangeEmailMutationVariables = Exact<{
  input: VerifyChangeEmailInput;
}>;


export type VerifyChangeEmailMutation = { __typename?: 'Mutation', verifyChangeEmail: { __typename?: 'VerifyChangeEmailOutput', ok: boolean, error?: string | null } };

export type VerifyEmailMutationVariables = Exact<{
  input: VerifyEmailInput;
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail: { __typename?: 'VerifyEmailOutput', ok: boolean, error?: string | null } };
