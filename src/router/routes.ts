const timetable = '/tt';
const create_patient = 'create-patient';
const reserve = 'reserve';
const editReservation = 'edit';

// auth
const auth = 'auth';
const login = 'login';
const signUp = 'sign-up';
const confirmEmail = 'confirm-email';
const editProfile = 'edit';

//dashboard
const dashboard = 'dashboard';
const member = 'member';
const invite = 'invite';
const prescription = 'prescription';
const statistics = 'statistics';
const create = 'create';
const clinics = 'clinics';

export const ROUTES = {
  confirmEmail: `/${auth}/${confirmEmail}`,
  editProfile: `/${auth}/${editProfile}`,
  search: 'search',
  dashboard,
  prescription: `/${dashboard}/${prescription}`,
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
    dashboard,
    member,
    invite,
    prescription,
    statistics,
    create,
    clinics,
  },
};

export type DashboardEndpoint = keyof typeof ENDPOINT.DASHBOARD;
