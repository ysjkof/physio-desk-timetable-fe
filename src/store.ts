import { ApolloClient, NormalizedCacheObject, makeVar } from '@apollo/client';
import { create } from 'zustand';
import { TableDisplay, TableTime } from './models';
import localStorageUtils from './utils/localStorage.utils';
import type {
  TableDisplayOptions,
  ToastState,
  TableTimeOptions,
  SelectedReservationType,
  SelectedPatientType,
  UserIdAndName,
} from './types/common.types';

export const selectedReservationVar =
  makeVar<SelectedReservationType>(undefined);

export type ClientOfStore = ApolloClient<NormalizedCacheObject> | null;

// Timetable state

export const tableTimeVar = makeVar<TableTimeOptions>(TableTime.get());

export const tableDisplayVar = makeVar<TableDisplayOptions>(TableDisplay.get());

export const selectedDateVar = makeVar(new Date());

export const selectedPatientVar = makeVar<SelectedPatientType>(undefined);

interface ZustandStoreState {
  isLoggedIn: boolean;
  client: ClientOfStore;
  selectedClinicId: number;
  toast: ToastState;
  isBigGlobalAside: boolean;
  hasSettingOfTimetable: boolean;
}

const initialState: ZustandStoreState = {
  isLoggedIn: false,
  client: null,
  selectedClinicId: 0,
  toast: {},
  isBigGlobalAside: true,
  hasSettingOfTimetable: false,
};

export const useStore = create<ZustandStoreState>(() => initialState);

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

export const toggleSettingOfTimetable = (value?: boolean) =>
  useStore.setState((state) => ({
    hasSettingOfTimetable:
      typeof value === 'undefined' ? !state.hasSettingOfTimetable : value,
  }));

export const resetStore = () => useStore.setState(() => initialState);

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
