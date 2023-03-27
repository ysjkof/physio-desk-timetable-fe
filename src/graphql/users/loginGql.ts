import { gql } from '@apollo/client';

export const LOGIN_DOCUMENT = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      ok
      error
      token
      authRequired
    }
  }
`;
