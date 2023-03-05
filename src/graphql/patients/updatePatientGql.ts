import { gql } from '@apollo/client';

export const UPDATE_PATIENT_DOCUMENT = gql`
  mutation updatePatient($input: UpdatePatientInput!) {
    updatePatient(input: $input) {
      ok
      error
    }
  }
`;
