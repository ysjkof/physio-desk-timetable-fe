import { gql } from '@apollo/client';
import { COMMON_PATIENT_FIELDS } from './_patientsFragmentsGql';

export const FIND_ALL_PATIENTS_DOCUMENT = gql`
  ${COMMON_PATIENT_FIELDS}
  query findAllPatients($input: FindAllPatientsInput!) {
    findAllPatients(input: $input) {
      ok
      error
      totalPages
      totalCount
      results {
        ...CommonPatientFields
        clinic {
          name
        }
      }
    }
  }
`;
