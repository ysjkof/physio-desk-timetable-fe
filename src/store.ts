import { ApolloClient, NormalizedCacheObject, makeVar } from '@apollo/client';
import { create } from 'zustand';
import { TableTime } from './models';
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

export const tableTimeVar = makeVar<TableTimeOptions>(TableTime.get());

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
}

const initialState: ZustandStoreState = {
  isLoggedIn: false,
  client: null,
  selectedClinicId: 0,
  toast: {},
  isBigGlobalAside: true,
  isWeekCalendar: true,
  showSettingOfTimetable: false,
  showCancelOfTimetable: false,
  showNoshowOfTimetable: false,
  showCalendarOfTimetable: false,
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

export const toggleGlobalAside = (value?: boolean) =>
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

export const toggleShowCancelOfTimetable = (value?: boolean) =>
  useStore.setState((state) => ({
    showCancelOfTimetable:
      typeof value === 'undefined' ? !state.showCancelOfTimetable : value,
  }));

export const toggleShowNoshowOfTimetable = (value?: boolean) =>
  useStore.setState((state) => ({
    showNoshowOfTimetable:
      typeof value === 'undefined' ? !state.showNoshowOfTimetable : value,
  }));
export const toggleShowCalendarOfTimetable = (value?: boolean) =>
  useStore.setState((state) => ({
    showCalendarOfTimetable:
      typeof value === 'undefined' ? !state.showCalendarOfTimetable : value,
  }));

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
