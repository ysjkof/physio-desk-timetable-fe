import { gql } from '@apollo/client';
import { COMMON_PATIENT_FIELDS } from './_patientsFragmentsGql';

export const GET_PATIENT_BY_DOCUMENT = gql`
  ${COMMON_PATIENT_FIELDS}
  query getPatientBy($input: GetPatientByInput!) {
    getPatientBy(input: $input) {
      error
      ok
      totalPages
      totalCount
      hasMore
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
