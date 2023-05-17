import { gql } from '@apollo/client';

export const GET_MESSAGES_DOCUMENT = gql`
  query getMessages($input: GetMessagesInput!) {
    getMessages(input: $input) {
      ok
      error
      totalCount
      hasMore
      results {
        id
        user {
          id
          name
        }
        patient {
          id
          name
          phone
        }
        to
        completeTime
        status
        statusName
      }
    }
  }
`;
