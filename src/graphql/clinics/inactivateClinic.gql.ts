import { gql } from '@apollo/client';

export const INACTIVATE_CLINIC_DOCUMENT = gql`
  mutation inactivateClinic($input: InactivateClinicInput!) {
    inactivateClinic(input: $input) {
      ok
      error
    }
  }
`;
