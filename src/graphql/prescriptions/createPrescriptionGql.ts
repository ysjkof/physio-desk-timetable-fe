import { gql } from '@apollo/client';
import { ALL_PRESCRIPTION_FIELDS } from './_prescriptionsFragmentsGql';

export const CREATE_PRESCRIPTION_DOCUMENT = gql`
  ${ALL_PRESCRIPTION_FIELDS}
  mutation createPrescription($input: CreatePrescriptionInput!) {
    createPrescription(input: $input) {
      ok
      error
      prescription {
        ...AllPrescriptionFields
        prescriptionAtoms {
          id
          name
        }
      }
    }
  }
`;
