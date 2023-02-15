import { gql } from '@apollo/client';

export const DEACTIVATE_CLINIC_DOCUMENT = gql`
  mutation deactivateClinic($input: DeactivateClinicInput!) {
    deactivateClinic(input: $input) {
      ok
      error
    }
  }
`;
