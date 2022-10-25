import { gql } from '@apollo/client';
import { COMMON_RESERVATION_FIELDS } from './_reservationsFragments.gql';

export const GET_STATISTICS_DOCUMENT = gql`
  ${COMMON_RESERVATION_FIELDS}
  query getStatistics($input: GetStatisticsInput!) {
    getStatistics(input: $input) {
      error
      ok
      prescriptions {
        id
        name
        price
        requiredTime
      }
      visitRates {
        patientId
        visited
      }
      dailyReports {
        date
        reservationCount
        noshow
        cancel
        newPatient
        users {
          userId
          reservationCount
          noshow
          cancel
          newPatient
          visitMoreThanThirty
          visitMoreThanSixty
          visitMoreThanNinety
          prescriptions {
            id
            name
            count
          }
          reservations {
            ...CommonReservationFields
            prescriptions {
              id
              name
              price
              requiredTime
            }
            patient {
              id
              name
            }
            lastModifier {
              id
              name
            }
          }
        }
      }
    }
  }
`;
