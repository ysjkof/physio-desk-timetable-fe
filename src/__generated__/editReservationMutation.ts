/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditReservationInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: editReservationMutation
// ====================================================

export interface editReservationMutation_editReservation {
  __typename: "EditReservationOutput";
  error: string | null;
  ok: boolean;
}

export interface editReservationMutation {
  editReservation: editReservationMutation_editReservation;
}

export interface editReservationMutationVariables {
  input: EditReservationInput;
}
