const timetable = 'tt';

// auth
const auth = 'auth';
const login = 'login';
const signUp = 'sign_up';
const confirmEmail = 'confirm_email';
const changeEmail = 'change_email';
const editProfile = 'edit_profile';

// dashboard
const dashboard = 'dashboard';
const member = 'member';
const prescription = 'prescription';
const statistics = 'statistics';

const invite = 'invite';
const create = 'create';
const clinics = 'clinics';

// docs
export const DOCS = 'docs';
const overview = 'overview';
export const basicPatientRegistration = 'basic_patient_registration';
export const basicPrescriptionRegistration = 'basic_prescription_registration';
export const basicReserve = 'basic_reserve';
const roadmap = 'roadmap';
const contacts = 'contacts';
const screenTimetable = `screen_${timetable}`;
const clinicRegistration = 'clinic_registration';
const viewDuration = 'view_duration';
const viewState = 'view_state';
const viewClinic = 'view_clinic';
const dashboardMember = `${dashboard}_${member}`;
const dashboardInvite = `${dashboard}_${invite}`;
const dashboardPrescription = `${dashboard}_${prescription}`;
const dashboardStatistics = `${dashboard}_${statistics}`;
const dashboardCreate = `${dashboard}_${create}`;
const dashboardClinics = `${dashboard}_${clinics}`;
const dashboardEditProfile = `${dashboard}_${editProfile}`;

export const ROUTES = {
  docs: `/${DOCS}`,
  overview: `/${DOCS}/${overview}`,
  basicPatientRegistration: `/${DOCS}/${basicPatientRegistration}`,
  basicPrescriptionRegistration: `/${DOCS}/${basicPrescriptionRegistration}`,
  basicReserve: `/${DOCS}/${basicReserve}`,
  viewDuration: `/${DOCS}/${viewDuration}`,
  viewState: `/${DOCS}/${viewState}`,
  viewClinic: `/${DOCS}/${viewClinic}`,
  roadmap: `/${DOCS}/${roadmap}`,
  contacts: `/${DOCS}/${contacts}`,
  search: '/search',
  timetable: `/${timetable}`,
  login: `/${auth}/${login}`,
  signUp: `/${auth}/${signUp}`,
  confirmEmail: `/${auth}/${confirmEmail}`,
  changeEmail: `/${auth}/${changeEmail}`,
  dashboard: `/${dashboard}`,
  member: `/${dashboard}/${member}`,
  invite: `/${dashboard}/${invite}`,
  prescription: `/${dashboard}/${prescription}`,
  statistics: `/${dashboard}/${statistics}`,
  create: `/${dashboard}/${create}`,
  clinics: `/${dashboard}/${clinics}`,
  editProfile: `/${dashboard}/${editProfile}`,
} as const;

export const ENDPOINT = {
  login,
  signUp,
  confirmEmail,
  dashboard: {
    dashboard,
    member,
    prescription,
    statistics,
    invite,
    create,
    clinics,
    editProfile,
  },
  docs: {
    overview,
    basicPatientRegistration,
    basicPrescriptionRegistration,
    basicReserve,
    viewDuration,
    viewState,
    viewClinic,
    roadmap,
    contacts,
    screenTimetable,
    clinicRegistration,
    dashboardMember,
    dashboardInvite,
    dashboardPrescription,
    dashboardStatistics,
    dashboardCreate,
    dashboardClinics,
    dashboardEditProfile,
  },
} as const;

export type DashboardEndpoint = keyof typeof ENDPOINT.dashboard;

export const clinicMenu = [
  { route: ENDPOINT.dashboard.member, name: '구성원' },
  { route: ENDPOINT.dashboard.invite, name: '초대' },
  { route: ENDPOINT.dashboard.prescription, name: '처방' },
  { route: ENDPOINT.dashboard.statistics, name: '통계' },
];

export const personalMenu = [
  { route: ENDPOINT.dashboard.editProfile, name: '나의 정보' },
  { route: ENDPOINT.dashboard.clinics, name: '나의 병원' },
  { route: ENDPOINT.dashboard.create, name: '병원 만들기' },
];
