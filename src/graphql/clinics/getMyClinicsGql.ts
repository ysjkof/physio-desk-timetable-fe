import { gql } from '@apollo/client';

import {
  COMMON_CLINIC_FIELDS,
  COMMON_MEMBER_FIELDS,
} from './_clinicsFragmentsGql';

export const GET_MY_CLINICS_DOCUMENT = gql`
  ${COMMON_CLINIC_FIELDS}
  ${COMMON_MEMBER_FIELDS}
  query getMyClinics($input: GetMyClinicsInput!) {
    getMyClinics(input: $input) {
      ok
      error
      clinics {
        ...CommonClinicFields
        members {
          ...CommonMemberFields
          color {
            value
          }
          user {
            id
            name
          }
        }
      }
    }
  }
`;
