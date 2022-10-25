import { gql } from '@apollo/client';

export const CHECK_ADMIN_DOCUMENT = gql`
  query checkAdmin($code: String!) {
    checkAdmin(code: $code) {
      ok
      error
    }
  }
`;
