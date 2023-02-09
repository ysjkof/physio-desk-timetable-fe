import { gql } from '@apollo/client';

export const REFUSE_INVITATION_DOCUMENT = gql`
  mutation refuseInvitation($input: RefuseInvitationInput!) {
    refuseInvitation(input: $input) {
      ok
      error
    }
  }
`;
