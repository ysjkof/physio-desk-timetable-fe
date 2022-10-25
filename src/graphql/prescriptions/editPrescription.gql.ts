import { gql } from '@apollo/client';

export const EDIT_PRESCRIPTION_DOCUMENT = gql`
  mutation editPrescription($input: EditPrescriptionInput!) {
    editPrescription(input: $input) {
      ok
      error
    }
  }
`;
