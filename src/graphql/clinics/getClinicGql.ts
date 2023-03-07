import { gql } from '@apollo/client';
import { USER_ID_NAME_EMAIL_FIELDS } from '../users/_usersFragmentsGql';
import { COMMON_MEMBER_FIELDS } from './_clinicsFragmentsGql';

export const GET_CLINIC_DOCUMENT = gql`
  ${COMMON_MEMBER_FIELDS}
  ${USER_ID_NAME_EMAIL_FIELDS}
  query getClinic($input: GetClinicInput!) {
    getClinic(input: $input) {
      ok
      error
      clinic {
        id
        name
        type
        isActive
        members {
          ...CommonMemberFields
          color {
            value
          }
          createdAt
          updatedAt
          user {
            ...UserIdNameEmailFields
          }
        }
      }
    }
  }
`;
