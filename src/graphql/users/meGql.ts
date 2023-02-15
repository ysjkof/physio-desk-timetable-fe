import { gql } from '@apollo/client';
import {
  COMMON_CLINIC_FIELDS,
  COMMON_MEMBER_FIELDS,
} from '../clinics/_clinicsFragmentsGql';

export const ME_DOCUMENT = gql`
  ${COMMON_CLINIC_FIELDS}
  ${COMMON_MEMBER_FIELDS}
  query me {
    me {
      id
      name
      email
      role
      verified
      members {
        ...CommonMemberFields
        clinic {
          ...CommonClinicFields
        }
      }
      notice {
        message
        read
      }
    }
  }
`;
