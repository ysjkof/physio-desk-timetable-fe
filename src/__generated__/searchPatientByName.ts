/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SearchPatientInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: searchPatientByName
// ====================================================

export interface searchPatientByName_searchPatientByName_patients {
  __typename: "Patient";
  name: string;
  gender: string;
  registrationNumber: string | null;
  birthday: any | null;
}

export interface searchPatientByName_searchPatientByName {
  __typename: "SearchPatientOutput";
  error: string | null;
  ok: boolean;
  totalPages: number | null;
  totalCount: number | null;
  patients: searchPatientByName_searchPatientByName_patients[] | null;
}

export interface searchPatientByName {
  searchPatientByName: searchPatientByName_searchPatientByName;
}

export interface searchPatientByNameVariables {
  input: SearchPatientInput;
}
