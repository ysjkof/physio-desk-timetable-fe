import { gql } from '@apollo/client';

export const CREATE_NEW_VERIFICATION_DOCUMENT = gql`
  mutation createNewVerification($input: CreateNewVerificationInput!) {
    createNewVerification(input: $input) {
      ok
      error
    }
  }
`;
