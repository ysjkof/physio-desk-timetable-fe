import { gql } from '@apollo/client';

export const INVITE_USER_DOCUMENT = gql`
  mutation inviteUser($input: InviteUserInput!) {
    inviteUser(input: $input) {
      ok
      error
    }
  }
`;
