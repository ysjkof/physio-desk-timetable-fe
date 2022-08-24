const timetable = '/tt';
const reserve = 'reserve';
const edit = 'edit';
const create_patient = 'create-patient';
const login = 'login';
const signUp = 'sign-up';
const confirmEmail = 'confirm-email';
const editProfile = 'edit-profile';

export const ROUTES = {
  confirmEmail: `/${confirmEmail}`,
  editProfile: `/${editProfile}`,
  search: 'search',
  dashboard: 'dashboard',
  timetable,
  reserve: `${timetable}/${reserve}`,
  createPatient: `${timetable}/${create_patient}`,
  editReservation: `${timetable}/${edit}`,
  login: `/${login}`,
  signUp: `/${signUp}`,
};
export const ENDPOINT = {
  reserve,
  edit,
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
