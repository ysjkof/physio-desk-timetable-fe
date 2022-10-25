import { gql } from '@apollo/client';

export const CANCEL_INVITATION_DOCUMENT = gql`
  mutation cancelInvitation($input: CancelInvitationInput!) {
    cancelInvitation(input: $input) {
      ok
      error
    }
  }
`;
