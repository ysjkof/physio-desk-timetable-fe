import { gql } from '@apollo/client';

export const LEAVE_CLINIC_DOCUMENT = gql`
  mutation leaveClinic($input: LeaveClinicInput!) {
    leaveClinic(input: $input) {
      ok
      error
    }
  }
`;
