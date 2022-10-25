import { gql } from '@apollo/client';

export const COMMON_CLINIC_FIELDS = gql`
  fragment CommonClinicFields on Clinic {
    id
    name
    type
    isActivated
  }
`;

export const COMMON_MEMBER_FIELDS = gql`
  fragment CommonMemberFields on Member {
    id
    accepted
    manager
    staying
  }
`;
