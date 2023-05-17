import { gql } from '@apollo/client';

export const GET_MESSAGES_BY_PATIENT_DOCUMENT = gql`
  query getMessagesByPatient($input: GetMessagesByPatientInput!) {
    getMessagesByPatient(input: $input) {
      ok
      error
      results {
        messages {
          id
          user {
            id
            name
          }
          content
          completeTime
          status
          statusName
          type
          to
        }
        totalCount
        hasMore
        patient {
          id
          name
        }
      }
    }
  }
`;
