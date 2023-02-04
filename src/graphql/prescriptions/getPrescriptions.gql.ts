import { gql } from '@apollo/client';

export const GET_PRESCRIPTIONS_DOCUMENT = gql`
  query getPrescriptions($input: GetPrescriptionsInput!) {
    getPrescriptions(input: $input) {
      ok
      error
      prescriptions {
        id
        name
        description
      }
    }
  }
`;
