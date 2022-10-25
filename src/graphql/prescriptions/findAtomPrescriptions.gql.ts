import { gql } from '@apollo/client';

export const FIND_ATOM_PRESCRIPTIONS_DOCUMENT = gql`
  query findAtomPrescriptions {
    findAtomPrescriptions {
      ok
      error
      results {
        id
        name
      }
    }
  }
`;
