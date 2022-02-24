/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ReservationState {
  Canceled = "Canceled",
  NoShow = "NoShow",
  Reserved = "Reserved",
}

export enum UserRole {
  Client = "Client",
  Customer = "Customer",
  TopAdmin = "TopAdmin",
}

export interface CreateAccountInput {
  email: string;
  password: string;
}

export interface CreatePatientInput {
  id?: number | null;
  createdAt?: any | null;
  updatedAt?: any | null;
  name?: string | null;
  gender?: string | null;
  registrationNumber?: string | null;
  birthday?: any | null;
  memo?: string | null;
}

export interface CreateReservationInput {
  startDate: any;
  endDate: any;
  memo?: string | null;
  patientId: number;
  therapistId?: number | null;
  groupId?: number | null;
}

export interface EditProfileInput {
  email?: string | null;
  password?: string | null;
}

export interface FindAllPatientsInput {
  page?: number | null;
}

export interface FindReservationByIdInput {
  reservationId: number;
}

export interface ListReservationsInput {
  date: any;
  viewOption: number;
  groupId?: number | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SearchPatientInput {
  page?: number | null;
  query: string;
}

export interface VerifyEmailInput {
  code: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
