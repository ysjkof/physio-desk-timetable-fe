import { gql } from '@apollo/client';

export const EDIT_PATIENT_DOCUMENT = gql`
  mutation editPatient($input: EditPatientInput!) {
    editPatient(input: $input) {
      error
      ok
    }
  }
`;
