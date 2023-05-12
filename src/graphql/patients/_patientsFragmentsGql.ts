import { gql } from '@apollo/client';

export const ALL_PATIENT_FIELDS = gql`
  fragment AllPatientFields on Patient {
    id
    registrationNumber
    name
    gender
    birthday
    memo
  }
`;
export const COMMON_PATIENT_FIELDS = gql`
  fragment CommonPatientFields on Patient {
    id
    registrationNumber
    name
    gender
    birthday
    phone
  }
`;
