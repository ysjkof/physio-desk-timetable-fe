import { ReservationState } from '../types/generatedTypes';

export const isProduction = import.meta.env.PROD;

// 한국 표준시(韓國標準時, KST, Korea Standard Time) = UTC+09:00
export const UTC_OPTION_KST = { string: '+0900', hour: 9, minute: 0 };
export const UTC_OPTION = {
  kor: UTC_OPTION_KST,
};

export const TABLE_MAIN_COMPONENT_LAYOUT_PADDING_TOP = 50; // px
export const TABLE_CELL_HEIGHT = 20; // px
export const TABLE_CELL_HEIGHT_IN_ONE_MINUTE = 2; // px
export const TABLE_TIME_GAP = 10; // 분 단위, 나중에 전역변수로 조절할 수 있게 고려

export const DASHBOARD_CONTAINER_WIDTH = 200;

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

export const DEFAULT_COLOR = 'rgb(51, 76, 111)';

export const STATISTICS_LABEL_COLORS = [
  ['#233d4d', '#fcca46', '#a1c181', '#fe7f2d', '#619b8a'],
  ['#0d3b66', '#f4d35e', '#faf0ca', '#f95738', '#ee964b'],
];

export const GENDER_KOR = {
  male: '남성',
  female: '여성',
} as const;

export const LOCALE = 'ko-KR';

export const LABEL_VISIBLE_MINUTES = ['00', '30'];

export const LABEL_COLORS = ['#333779', '#DDDDEF'];

export const LATEST_STORAGE_VERSION = new Date('2023-03-08T00:00:00.000Z');

// product info
export const SERVICE_NAME = { ko: '피지오데스크', en: 'Physio Desk' };
export const COMPANY_NAME = '도히';
export const OWNER_NAME = '이성진';
export const CONTACT_EMAIL = 'dohi.physiodesk@gmail.com';
export const INSTAGRAM_SERVICE_USERNAME = 'physio_desk';

export const GA4_TRACKING_ID = 'G-5B55DVGX1C';
