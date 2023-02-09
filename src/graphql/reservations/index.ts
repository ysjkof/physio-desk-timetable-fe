import { CREATE_DAY_OFF_DOCUMENT } from './createDayOff.gql';
import { CREATE_RESERVATION_DOCUMENT } from './createReservation.gql';
import { DELETE_RESERVATION_DOCUMENT } from './deleteReservation.gql';
import { EDIT_RESERVATION_DOCUMENT } from './editReservation.gql';
import { GET_RESERVATIONS_BY_PATIENT_DOCUMENT } from './getReservationsByPatient.gql';
import { GET_STATISTICS_DOCUMENT } from './getStastics.gql';
import { LIST_RESERVATIONS_DOCUMENT } from './listReservations.gql';
import { COMMON_RESERVATION_FIELDS } from './_reservationsFragments.gql';
import { GET_RESERVATIONS_OF_MEMBER_DOCUMENT } from './getReservationsOfMember.gql';

export {
  CREATE_DAY_OFF_DOCUMENT,
  CREATE_RESERVATION_DOCUMENT,
  DELETE_RESERVATION_DOCUMENT,
  EDIT_RESERVATION_DOCUMENT,
  GET_RESERVATIONS_BY_PATIENT_DOCUMENT,
  GET_STATISTICS_DOCUMENT,
  LIST_RESERVATIONS_DOCUMENT,
  COMMON_RESERVATION_FIELDS,
  GET_RESERVATIONS_OF_MEMBER_DOCUMENT,
};
