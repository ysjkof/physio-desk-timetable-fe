import { gql } from '@apollo/client';

export const ALL_PRESCRIPTION_FIELDS = gql`
  fragment AllPrescriptionFields on Prescription {
    id
    name
    requiredTime
    description
    price
    isActive
  }
`;
export const COMMON_PRESCRIPTION_FIELDS = gql`
  fragment CommonPrescriptionFields on Prescription {
    id
    name
    requiredTime
    description
    price
  }
`;
