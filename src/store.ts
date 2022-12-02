import { makeVar } from '@apollo/client';
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
