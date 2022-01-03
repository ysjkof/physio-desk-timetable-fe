/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FindAllPatientsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: findAllPatientsQuery
// ====================================================

export interface findAllPatientsQuery_findAllPatients_results {
  __typename: "Patient";
  id: number;
  name: string;
  gender: string;
  birthday: string;
}

export interface findAllPatientsQuery_findAllPatients {
  __typename: "FindAllPatientsOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalCount: number | null;
  results: findAllPatientsQuery_findAllPatients_results[] | null;
}

export interface findAllPatientsQuery {
  findAllPatients: findAllPatientsQuery_findAllPatients;
}

export interface findAllPatientsQueryVariables {
  input: FindAllPatientsInput;
}
