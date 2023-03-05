import { gql } from '@apollo/client';

export const UPDATE_PRESCRIPTION_DOCUMENT = gql`
  mutation updatePrescription($input: UpdatePrescriptionInput!) {
    updatePrescription(input: $input) {
      ok
      error
    }
  }
`;
