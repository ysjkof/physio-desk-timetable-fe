import { gql } from '@apollo/client';

export const CREATE_ATOM_PRESCRIPTION_DOCUMENT = gql`
  mutation createAtomPrescription($input: CreateAtomPrescriptionInput!) {
    createAtomPrescription(input: $input) {
      ok
      error
    }
  }
`;
