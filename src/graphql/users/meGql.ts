import { gql } from '@apollo/client';
import {
  COMMON_CLINIC_FIELDS,
  COMMON_MEMBER_FIELDS,
} from '../clinics/_clinicsFragmentsGql';
import { USER_ID_NAME_NICKNAME_EMAIL_FIELDS } from './_usersFragmentsGql';

export const ME_DOCUMENT = gql`
  ${COMMON_CLINIC_FIELDS}
  ${COMMON_MEMBER_FIELDS}
  ${USER_ID_NAME_NICKNAME_EMAIL_FIELDS}
  query me {
    me {
      ...UserIdNameNicknameEmailFields
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
