/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreatePatientInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createPatientMutation
// ====================================================

export interface createPatientMutation_createPatient {
  __typename: "CreatePatientOutput";
  ok: boolean;
  error: string | null;
}

export interface createPatientMutation {
  createPatient: createPatientMutation_createPatient;
}

export interface createPatientMutationVariables {
  createPatientInput: CreatePatientInput;
}
