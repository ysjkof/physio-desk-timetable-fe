import { gql } from '@apollo/client';
import { ALL_PRESCRIPTION_FIELDS } from './_prescriptionsFragments.gql';

export const FIND_PRESCRIPTIONS_DOCUMENT = gql`
  ${ALL_PRESCRIPTION_FIELDS}
  query findPrescriptions($input: FindPrescriptionsInput!) {
    findPrescriptions(input: $input) {
      ok
      error
      prescriptions {
        ...AllPrescriptionFields
        prescriptionAtoms {
          id
          name
        }
      }
    }
  }
`;
