import { ApolloClient, NormalizedCacheObject, makeVar } from '@apollo/client';
import { create } from 'zustand';
import localStorageUtils from './utils/localStorage.utils';
import type {
  ToastState,
  TableTimeOptions,
  SelectedReservationType,
  SelectedPatientType,
  UserIdAndName,
} from './types/common.types';
import { TABLE_TIME_GAP } from './constants/constants';

export const selectedReservationVar =
  makeVar<SelectedReservationType>(undefined);

export type ClientOfStore = ApolloClient<NormalizedCacheObject> | null;

// Timetable state

export const selectedDateVar = makeVar(new Date());

export const selectedPatientVar = makeVar<SelectedPatientType>(undefined);

interface ZustandStoreState {
  isLoggedIn: boolean;
  client: ClientOfStore;
  selectedClinicId: number;
  toast: ToastState;
  isBigGlobalAside: boolean;
  isWeekCalendar: boolean;
  showSettingOfTimetable: boolean;
  showCancelOfTimetable: boolean;
  showNoshowOfTimetable: boolean;
  showCalendarOfTimetable: boolean;
  timeDurationOfTimetable: TableTimeOptions;
}

const initialState: ZustandStoreState = {
  isLoggedIn: false,
  client: null,
  selectedClinicId: 0,
  toast: {},
  isBigGlobalAside: true,
  isWeekCalendar: true,
  showSettingOfTimetable: false,
  showCancelOfTimetable: true,
  showNoshowOfTimetable: true,
  showCalendarOfTimetable: false,
  timeDurationOfTimetable: {
    firstHour: 9,
    firstMinute: 0,
    lastHour: 19,
    lastMinute: 0,
    gap: TABLE_TIME_GAP,
  },
};

export const useStore = create<ZustandStoreState>(() => initialState);

// 전역

export const setAuthToken = (_token?: string) =>
  useStore.setState(() => {
    let token: string | null | undefined = _token;
    if (!_token) {
      token = localStorageUtils.get({ key: 'token' });
    }
    return { isLoggedIn: !!token };
  });

export const setClient = (client: ClientOfStore) =>
  useStore.setState(() => ({ client }));

export const setClinicId = (clinicId: number) =>
  useStore.setState(() => ({ selectedClinicId: clinicId }));

export const setToast = (props: ToastState) =>
  useStore.setState(() => ({ toast: props }));

export const setGlobalAside = (value?: boolean) =>
  useStore.setState((state) => ({
    isBigGlobalAside:
      typeof value === 'undefined' ? !state.isBigGlobalAside : value,
  }));

export const resetStore = () => useStore.setState(() => initialState);

// 시간표

export const toggleIsWeekCalendar = (value?: boolean) =>
  useStore.setState((state) => ({
    isWeekCalendar:
      typeof value === 'undefined' ? !state.isWeekCalendar : value,
  }));

export const toggleSettingOfTimetable = (value?: boolean) =>
  useStore.setState((state) => ({
    showSettingOfTimetable:
      typeof value === 'undefined' ? !state.showSettingOfTimetable : value,
  }));

export const setShowCancelOfTimetable = (value?: boolean) =>
  useStore.setState((state) => ({
    showCancelOfTimetable:
      typeof value === 'undefined' ? !state.showCancelOfTimetable : value,
  }));

export const setShowNoshowOfTimetable = (value?: boolean) =>
  useStore.setState((state) => ({
    showNoshowOfTimetable:
      typeof value === 'undefined' ? !state.showNoshowOfTimetable : value,
  }));
export const toggleShowCalendarOfTimetable = (value?: boolean) =>
  useStore.setState((state) => ({
    showCalendarOfTimetable:
      typeof value === 'undefined' ? !state.showCalendarOfTimetable : value,
  }));

export const setTimeDurationOfTimetable = (value: TableTimeOptions) =>
  useStore.setState(() => ({ timeDurationOfTimetable: value }));

// store + localStorage

interface SelectClinicId extends UserIdAndName {
  clinicId: number;
}
export const selectClinicId = ({
  clinicId,
  userId,
  userName,
}: SelectClinicId) => {
  setClinicId(clinicId);
  localStorageUtils.set({
    key: 'selectedClinicId',
    value: clinicId,
    userId,
    userName,
  });
};

export const toggleIsBigGlobalAside = (value: boolean) => {
  setGlobalAside(value);
  localStorageUtils.set({ key: 'isBigGlobalAside', value });
};

interface SetStorageWithBoolean {
  userId: number;
  userName: string;
  value: boolean;
}

export const toggleShowCancelOfTimetable = ({
  userId,
  userName,
  value,
}: SetStorageWithBoolean) => {
  setShowCancelOfTimetable(value);
  localStorageUtils.set({
    key: 'showCancelOfTimetable',
    userId,
    userName,
    value,
  });
};

export const toggleShowNoshowOfTimetable = ({
  userId,
  userName,
  value,
}: SetStorageWithBoolean) => {
  setShowNoshowOfTimetable(value);
  localStorageUtils.set({
    key: 'showNoshowOfTimetable',
    userId,
    userName,
    value,
  });
};
