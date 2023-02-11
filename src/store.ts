import { ApolloClient, NormalizedCacheObject, makeVar } from '@apollo/client';
import { create } from 'zustand';
import { TableDisplay, TableTime } from './models';
import localStorageUtils from './utils/localStorage.utils';
import type {
  TableDisplayOptions,
  LoggedInUser,
  ToastState,
  TableTimeOptions,
  SelectedReservationType,
  SelectedPatientType,
  ClinicOfClient,
  UserIdAndName,
} from './types/common.types';

// global state
export const loggedInUserVar = makeVar<LoggedInUser>(undefined);

export const clinicListsVar = makeVar<ClinicOfClient[]>([]);

export const toastVar = makeVar<ToastState>({});

// Timetable state
export const hasTableDisplayVar = makeVar(false);

export const tableTimeVar = makeVar<TableTimeOptions>(TableTime.get());

export const tableDisplayVar = makeVar<TableDisplayOptions>(TableDisplay.get());

export const selectedDateVar = makeVar(new Date());

export const selectedPatientVar = makeVar<SelectedPatientType>(undefined);

export const selectedReservationVar =
  makeVar<SelectedReservationType>(undefined);

export type ClientOfStore = ApolloClient<NormalizedCacheObject> | null;
interface ZustandStoreState {
  isLoggedIn: boolean;
  client: ClientOfStore;
  selectedClinicId: number;
}

const initialState = {
  isLoggedIn: false,
  client: null,
  selectedClinicId: 0,
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
