import { gql } from '@apollo/client';

export const SEND_MESSAGE_DOCUMENT = gql`
  mutation sendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      ok
      error
    }
  }
`;
