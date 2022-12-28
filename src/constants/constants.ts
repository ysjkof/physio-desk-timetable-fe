import { ReservationState } from '../types/generated.types';

// 한국 표준시(韓國標準時, KST, Korea Standard Time) = UTC+09:00
export const UTC_OPTION_KST = { string: '+0900', hour: 9, minute: 0 };
export const UTC_OPTION = {
  kor: UTC_OPTION_KST,
};

export const TABLE_MAIN_COMPONENT_LAYOUT_PADDING_TOP = 50; // px
export const TABLE_CELL_HEIGHT = 20; // px
export const TABLE_CELL_HEIGHT_IN_ONE_MINUTE = 2; // px
export const TABLE_TIME_GAP = 10; // 분 단위, 나중에 전역변수로 조절할 수 있게 고려

export const NEXT = 'next';
export const PREV = 'prev';
export const SCROLL_ADDRESS = 'scroll-address-';

// Reservation State 한글
export const RESERVATION_STATE_KOR = {
  [ReservationState.Canceled]: '취소',
  [ReservationState.NoShow]: '부도',
  [ReservationState.Reserved]: '예약',
  [ReservationState.DayOff]: '예약잠금',
};

// 통계
export const STATISTICS_LABEL = {
  reservationCount: { kor: '예약', eng: 'reservationCount' } as const,
  newPatient: { kor: '신규', eng: 'newPatient' } as const,
  noshow: { kor: '부도', eng: 'noshow' } as const,
  cancel: { kor: '취소', eng: 'cancel' } as const,
  visitMoreThanThirty: {
    kor: '방문한지 30일 경과',
    eng: 'visitMoreThanThirty',
  } as const,
};

export const DASHBOARD_MENU_KR = {
  dashboard: '처음',
  member: '구성원',
  invite: '초대',
  prescription: '처방관리',
  statistics: '통계',
  create: '병원 만들기',
  clinics: '나의 병원',
  editProfile: '나의 정보',
};

export const STATISTICS_LABEL_COLORS = [
  ['#233d4d', '#fcca46', '#a1c181', '#fe7f2d', '#619b8a'],
  ['#0d3b66', '#f4d35e', '#faf0ca', '#f95738', '#ee964b'],
];

export const USER_COLORS = [
  // light : bg-color-100
  { deep: '#FCA5A5', light: '#FEE2E2' },
  { deep: '#FDBA74', light: '#FFEDD5' },
  { deep: '#FDE047', light: '#FEF9C3' },
  { deep: '#86EFAC', light: '#DCFCE7' },
  { deep: '#93C5FD', light: '#DBEAFE' },
  { deep: '#A5B4FC', light: '#E0E7FF' },
  { deep: '#C4B5FD', light: '#EDE9FE' },
];
// export const USER_COLORS = [
//   // light : bg-color-50
//   { deep: "#FCA5A5", light: "#FEF2F2" },
//   { deep: "#FDBA74", light: "#FFF7ED" },
//   { deep: "#FDE047", light: "#FEFCE8" },
//   { deep: "#86EFAC", light: "#F0FDF4" },
//   { deep: "#93C5FD", light: "#EFF6FF" },
//   { deep: "#A5B4FC", light: "#EEF2FF" },
//   { deep: "#C4B5FD", light: "#F5F3FF" },
// ];

const milliseconds = 3000;
export const defaultToastTimeout = milliseconds;

export const MUOOL = 'Muool';

export const GENDER_KOR = {
  male: '남성',
  female: '여성',
} as const;

export const LOCALE = 'ko-KR';

export const LABEL_VISIBLE_MINUTES = ['00', '30'];

export const LABEL_COLORS = ['#333779', '#DDDDEF'];

export const LATEST_STORAGE_VERSION = '2022-12-28T00:00:50.000Z';
