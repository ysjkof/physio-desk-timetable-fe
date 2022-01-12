/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ListReservationsInput, ReservationState } from "./globalTypes";

// ====================================================
// GraphQL query operation: listReservationsQuery
// ====================================================

export interface listReservationsQuery_listReservations_results_patient {
  __typename: "Patient";
  name: string;
  gender: string;
}

export interface listReservationsQuery_listReservations_results_lastModifier {
  __typename: "User";
  email: string;
}

export interface listReservationsQuery_listReservations_results {
  __typename: "Reservation";
  id: number;
  startDate: any;
  endDate: any;
  state: ReservationState;
  memo: string | null;
  patient: listReservationsQuery_listReservations_results_patient;
  lastModifier: listReservationsQuery_listReservations_results_lastModifier;
}

export interface listReservationsQuery_listReservations {
  __typename: "ListReservationsOutput";
  ok: boolean;
  totalCount: number | null;
  results: listReservationsQuery_listReservations_results[] | null;
}

export interface listReservationsQuery {
  listReservations: listReservationsQuery_listReservations;
}

export interface listReservationsQueryVariables {
  input: ListReservationsInput;
}
