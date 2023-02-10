import { ApolloClient, NormalizedCacheObject, makeVar } from '@apollo/client';
import { create } from 'zustand';
import { TableDisplay, TableTime } from './models';
import type {
  TableDisplayOptions,
  LoggedInUser,
  ToastState,
  TableTimeOptions,
  SelectedReservationType,
  SelectedPatientType,
  ClinicOfClient,
} from './types/common.types';
import localStorageUtils from './utils/localStorage.utils';

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
  authToken: string | null;
  client: ClientOfStore;
}
interface ZustandStoreAction {
  setAuthToken: (token?: string) => void;
  setClient: (client: ApolloClient<NormalizedCacheObject>) => void;
  reset: () => void;
}

const initialState = {
  isLoggedIn: false,
  authToken: null,
  client: null,
};

export const useStore = create<ZustandStoreState & ZustandStoreAction>(
  (set) => ({
    ...initialState,
    setAuthToken: (_token) =>
      set(() => {
        let token: string | null | undefined = _token;
        if (!_token) {
          token = localStorageUtils.get({ key: 'token' });
        }
        return { authToken: token, isLoggedIn: !!token };
      }),
    setClient: (client) => set(() => ({ client })),
    reset: () => set(initialState),
  })
);
