/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteReservationInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deleteReservationMutation
// ====================================================

export interface deleteReservationMutation_deleteReservation {
  __typename: "DeleteReservationOutput";
  error: string | null;
  ok: boolean;
}

export interface deleteReservationMutation {
  deleteReservation: deleteReservationMutation_deleteReservation;
}

export interface deleteReservationMutationVariables {
  input: DeleteReservationInput;
}
