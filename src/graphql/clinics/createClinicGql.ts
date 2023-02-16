import { gql } from '@apollo/client';
import { COMMON_MEMBER_FIELDS } from './_clinicsFragmentsGql';

export const CREATE_CLINIC_DOCUMENT = gql`
  ${COMMON_MEMBER_FIELDS}
  mutation createClinic($input: CreateClinicInput!) {
    createClinic(input: $input) {
      ok
      error
      clinic {
        id
        name
        type
        isActivated
        members {
          ...CommonMemberFields
          createdAt
          user {
            id
            name
          }
        }
      }
    }
  }
`;
