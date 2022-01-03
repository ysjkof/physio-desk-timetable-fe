/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateReservationInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createReservationMutation
// ====================================================

export interface createReservationMutation_createReservation {
  __typename: "CreateReservationOutput";
  ok: boolean;
  error: string | null;
}

export interface createReservationMutation {
  createReservation: createReservationMutation_createReservation;
}

export interface createReservationMutationVariables {
  input: CreateReservationInput;
}
