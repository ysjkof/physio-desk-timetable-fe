import { gql } from '@apollo/client';

export const GET_MESSAGES_EACH_PATIENT_DOCUMENT = gql`
  query getMessagesEachPatient($input: GetMessagesEachPatientInput!) {
    getMessagesEachPatient(input: $input) {
      ok
      error
      hasMore
      results {
        id
        message {
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
  }
`;
