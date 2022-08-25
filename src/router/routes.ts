const timetable = '/tt';
const create_patient = 'create-patient';
const reserve = 'reserve';
const editReservation = 'edit';

const auth = 'auth';
const login = 'login';
const signUp = 'sign-up';
const confirmEmail = 'confirm-email';
const editProfile = 'edit';

export const ROUTES = {
  confirmEmail: `/${auth}/${confirmEmail}`,
  editProfile: `/${auth}/${editProfile}`,
  search: 'search',
  dashboard: 'dashboard',
  timetable,
  reserve: `${timetable}/${reserve}`,
  createPatient: `${timetable}/${create_patient}`,
  editReservation: `${timetable}/${editReservation}`,
  login: `/${auth}/${login}`,
  signUp: `/${auth}/${signUp}`,
};
export const ENDPOINT = {
  reserve,
  editReservation,
  create_patient,
  login,
  signUp,
  confirmEmail,
  editProfile,
  DASHBOARD: {
    member: 'member',
    invite: 'invite',
    prescription: 'prescription',
    statistics: 'statistics',
    create: 'create',
    clinics: 'clinics',
  },
};
