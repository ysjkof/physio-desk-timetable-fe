import { gql } from '@apollo/client';
import { ALL_PATIENT_FIELDS } from './_patientsFragmentsGql';

export const CREATE_PATIENT_DOCUMENT = gql`
  ${ALL_PATIENT_FIELDS}
  mutation createPatient($input: CreatePatientInput!) {
    createPatient(input: $input) {
      ok
      error
      patient {
        ...AllPatientFields
        users {
          id
          name
        }
      }
    }
  }
`;
