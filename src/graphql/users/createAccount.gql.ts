import { gql } from '@apollo/client';

export const CREATE_ACCOUNT_DOCUMENT = gql`
  mutation createAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      ok
      error
    }
  }
`;
