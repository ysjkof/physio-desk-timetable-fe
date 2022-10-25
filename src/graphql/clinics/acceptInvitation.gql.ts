import { gql } from '@apollo/client';

export const ACCEPT_INVITATION_DOCUMENT = gql`
  mutation acceptInvitation($input: AcceptInvitationInput!) {
    acceptInvitation(input: $input) {
      ok
      error
    }
  }
`;
