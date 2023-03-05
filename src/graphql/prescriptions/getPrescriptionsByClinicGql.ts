import { gql } from '@apollo/client';
import { ALL_PRESCRIPTION_FIELDS } from './_prescriptionsFragmentsGql';

export const GET_PRESCRIPTIONS_BY_CLINIC_DOCUMENT = gql`
  ${ALL_PRESCRIPTION_FIELDS}
  query getPrescriptionsByClinic($input: GetPrescriptionsByClinicInput!) {
    getPrescriptionsByClinic(input: $input) {
      ok
      error
      prescriptions {
        ...AllPrescriptionFields
        prescriptionAtoms {
          id
          name
        }
      }
      count
      maximumCount
    }
  }
`;
