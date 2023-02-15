import { gql } from '@apollo/client';
import {
  COMMON_CLINIC_FIELDS,
  COMMON_MEMBER_FIELDS,
} from './_clinicsFragmentsGql';

export const CREATE_CLINIC_DOCUMENT = gql`
  ${COMMON_CLINIC_FIELDS}
  ${COMMON_MEMBER_FIELDS}
  mutation createClinic($input: CreateClinicInput!) {
    createClinic(input: $input) {
      ok
      error
      clinic {
        ...CommonClinicFields
        members {
          ...CommonMemberFields
          user {
            id
            name
          }
        }
      }
    }
  }
`;
