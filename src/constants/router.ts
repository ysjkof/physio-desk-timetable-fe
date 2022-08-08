const TIMETABLE = '/tt';
const AUTH = 'auth';
const RESERVE = 'reserve';
const EDIT = 'edit';
const CREATE_PATIENT = 'create-patient';
const LOGIN = 'login';
const SIGN_UP = 'sign-up';

export const ROUTER = {
  CONFIRM_EMAIL: 'confirm',
  EDIT_PROFILE: 'edit-profile',
  SEARCH: 'search',
  DASHBOARD: 'dashboard',
  AUTH,
  TIMETABLE,
  RESERVE_DETAIL: `${TIMETABLE}/${RESERVE}`,
  RESERVE_EDIT: `${TIMETABLE}/${EDIT}`,
  LOGIN: `${AUTH}/${LOGIN}`,
  SIGN_UP: `${AUTH}/${SIGN_UP}`,
  ENDPOINT: {
    RESERVE,
    EDIT,
    CREATE_PATIENT,
    LOGIN,
    SIGN_UP,
  },
};
