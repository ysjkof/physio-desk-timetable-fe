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
  code: Scalars['String'];
};

export type AcceptInvitationOutput = {
  __typename?: 'AcceptInvitationOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type CreateAccountInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type CreateAccountOutput = {
  __typename?: 'CreateAccountOutput';
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
  createdAt?: InputMaybe<Scalars['DateTime']>;
  gender?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Float']>;
  memo?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  registrationNumber?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
};

export type CreatePatientOutput = {
  __typename?: 'CreatePatientOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type CreateReservationInput = {
  endDate: Scalars['DateTime'];
  groupId?: InputMaybe<Scalars['Float']>;
  memo?: InputMaybe<Scalars['String']>;
  patientId: Scalars['Float'];
  startDate: Scalars['DateTime'];
  therapistId?: InputMaybe<Scalars['Float']>;
};

export type CreateReservationOutput = {
  __typename?: 'CreateReservationOutput';
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

export type EditPatientInput = {
  birthday?: InputMaybe<Scalars['DateTime']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  gender?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Float']>;
  memo?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  registrationNumber?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['DateTime']>;
};

export type EditPatientOutput = {
  __typename?: 'EditPatientOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type EditProfileInput = {
  email?: InputMaybe<Scalars['String']>;
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

export type FindGroupByIdInput = {
  groupId: Scalars['Int'];
};

export type FindGroupByIdOutput = {
  __typename?: 'FindGroupByIdOutput';
  error?: Maybe<Scalars['String']>;
  group?: Maybe<Group>;
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
  createdAt: Scalars['DateTime'];
  id: Scalars['Float'];
  members: Array<MemberForm>;
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
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
  groupId?: InputMaybe<Scalars['Int']>;
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

export type MemberForm = {
  __typename?: 'MemberForm';
  accepted: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  group: Group;
  id: Scalars['Float'];
  isStaying: Scalars['Boolean'];
  manager: Scalars['Boolean'];
  member: User;
  updatedAt: Scalars['DateTime'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvitation: AcceptInvitationOutput;
  createAccount: CreateAccountOutput;
  createGroup: CreateGroupOutput;
  createPatient: CreatePatientOutput;
  createReservation: CreateReservationOutput;
  deletePatient: DeletePatientOutput;
  deleteReservation: DeleteReservationOutput;
  editPatient: EditPatientOutput;
  editProfile: EditProfileOutput;
  editReservation: EditReservationOutput;
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


export type MutationCreateGroupArgs = {
  input: CreateGroupInput;
};


export type MutationCreatePatientArgs = {
  input: CreatePatientInput;
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
  createdAt: Scalars['DateTime'];
  id: Scalars['Float'];
  message: Scalars['String'];
  read: Scalars['Boolean'];
  updatedAt: Scalars['DateTime'];
};

export type Patient = {
  __typename?: 'Patient';
  birthday?: Maybe<Scalars['DateTime']>;
  createdAt: Scalars['DateTime'];
  gender: Scalars['String'];
  id: Scalars['Float'];
  memo?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  registrationNumber?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};

export type Query = {
  __typename?: 'Query';
  findAllPatients: FindAllPatientsOutput;
  findGroupById: FindGroupByIdOutput;
  findPatientById: FindPatientByIdOutput;
  findReservationById: FindReservationByIdOutput;
  findReservationByPatient: FindReservationByPatientOutput;
  listReservations: ListReservationsOutput;
  me: User;
  searchPatientByName: SearchPatientOutput;
  userProfile: UserProfileOutput;
};


export type QueryFindAllPatientsArgs = {
  input: FindAllPatientsInput;
};


export type QueryFindGroupByIdArgs = {
  input: FindGroupByIdInput;
};


export type QueryFindPatientByIdArgs = {
  input: FindPatientByIdInput;
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


export type QueryUserProfileArgs = {
  userId: Scalars['Float'];
};

export type Reservation = {
  __typename?: 'Reservation';
  createdAt: Scalars['DateTime'];
  endDate: Scalars['DateTime'];
  group?: Maybe<Group>;
  id: Scalars['Float'];
  lastModifier: User;
  memo?: Maybe<Scalars['String']>;
  patient: Patient;
  startDate: Scalars['DateTime'];
  state: ReservationState;
  therapist: User;
  updatedAt: Scalars['DateTime'];
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

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['Float'];
  memberForms: Array<MemberForm>;
  notice?: Maybe<Array<Notice>>;
  password: Scalars['String'];
  role: UserRole;
  updatedAt: Scalars['DateTime'];
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

export type SearchPatientByNameQueryVariables = Exact<{
  input: SearchPatientInput;
}>;


export type SearchPatientByNameQuery = { __typename?: 'Query', searchPatientByName: { __typename?: 'SearchPatientOutput', error?: string | null, ok: boolean, totalPages?: number | null, totalCount?: number | null, patients?: Array<{ __typename?: 'Patient', id: number, name: string, gender: string, registrationNumber?: string | null, birthday?: any | null }> | null } };


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