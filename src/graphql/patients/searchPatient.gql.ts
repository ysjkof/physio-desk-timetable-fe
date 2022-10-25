import { gql } from '@apollo/client';
import { COMMON_PATIENT_FIELDS } from './_patientsFragments.gql';

export const SEARCH_PATIENT_DOCUMENT = gql`
  ${COMMON_PATIENT_FIELDS}
  query searchPatient($input: SearchPatientInput!) {
    searchPatient(input: $input) {
      error
      ok
      totalPages
      totalCount
      patients {
        ...CommonPatientFields
        clinic {
          id
          name
        }
        users {
          id
          name
        }
      }
    }
  }
`;
