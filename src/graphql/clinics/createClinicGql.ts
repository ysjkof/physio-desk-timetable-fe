import { gql } from '@apollo/client';
import { COMMON_MEMBER_FIELDS } from './_clinicsFragmentsGql';
import { USER_ID_NAME_EMAIL_FIELDS } from '../users';

export const CREATE_CLINIC_DOCUMENT = gql`
  ${COMMON_MEMBER_FIELDS}
  ${USER_ID_NAME_EMAIL_FIELDS}
  mutation createClinic($input: CreateClinicInput!) {
    createClinic(input: $input) {
      ok
      error
      clinic {
        id
        name
        type
        isActive
        members {
          ...CommonMemberFields
          createdAt
          user {
            ...UserIdNameEmailFields
          }
        }
      }
    }
  }
`;
