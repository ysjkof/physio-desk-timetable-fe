import { gql } from '@apollo/client';

export const CREATE_DAY_OFF_DOCUMENT = gql`
  mutation createDayOff($input: CreateDayOffInput!) {
    createDayOff(input: $input) {
      ok
      error
    }
  }
`;
