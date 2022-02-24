/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FindReservationByIdInput, ReservationState } from "./globalTypes";

// ====================================================
// GraphQL query operation: findReservationById
// ====================================================

export interface findReservationById_findReservationById_reservation_therapist {
  __typename: "User";
  id: number;
  email: string;
}

export interface findReservationById_findReservationById_reservation_patient {
  __typename: "Patient";
  name: string;
  gender: string;
  registrationNumber: string | null;
  birthday: any | null;
}

export interface findReservationById_findReservationById_reservation_group {
  __typename: "Group";
  id: number;
  name: string;
}

export interface findReservationById_findReservationById_reservation_lastModifier {
  __typename: "User";
  email: string;
}

export interface findReservationById_findReservationById_reservation {
  __typename: "Reservation";
  id: number;
  startDate: any;
  endDate: any;
  state: ReservationState;
  memo: string | null;
  therapist: findReservationById_findReservationById_reservation_therapist;
  patient: findReservationById_findReservationById_reservation_patient;
  group: findReservationById_findReservationById_reservation_group | null;
  lastModifier: findReservationById_findReservationById_reservation_lastModifier;
}

export interface findReservationById_findReservationById {
  __typename: "FindReservationByIdOutput";
  error: string | null;
  ok: boolean;
  reservation: findReservationById_findReservationById_reservation | null;
}

export interface findReservationById {
  findReservationById: findReservationById_findReservationById;
}

export interface findReservationByIdVariables {
  input: FindReservationByIdInput;
}
