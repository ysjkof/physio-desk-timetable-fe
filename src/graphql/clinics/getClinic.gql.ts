import { gql } from '@apollo/client';
import { USER_ID_NAME_EMAIL_FIELDS } from '../users/_usersFragments.gql';
import { COMMON_MEMBER_FIELDS } from './_clinicsFragments.gql';

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
        members {
          ...CommonMemberFields
          user {
            ...UserIdNameEmailFields
          }
        }
      }
    }
  }
`;
