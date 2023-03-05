import { gql } from '@apollo/client';

export const GET_ATOM_PRESCRIPTIONS_DOCUMENT = gql`
  query getAtomPrescriptions {
    getAtomPrescriptions {
      ok
      error
      results {
        id
        name
      }
    }
  }
`;
