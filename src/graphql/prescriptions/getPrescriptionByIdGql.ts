import { gql } from '@apollo/client';

export const GET_PRESCRIPTION_BY_ID_DOCUMENT = gql`
  query getPrescriptionById($input: GetPrescriptionByIdInput!) {
    getPrescriptionById(input: $input) {
      ok
      error
      prescription {
        id
        name
        description
      }
    }
  }
`;
