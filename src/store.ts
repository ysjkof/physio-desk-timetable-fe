import { makeVar } from '@apollo/client';
import { TableDisplay, TableTime } from './models';
import type {
  IClinicList,
  TableDisplayOptions,
  LoggedInUser,
  ToastState,
  TableTimeOptions,
  SelectedReservationType,
  SelectedPatientType,
} from './types/common.types';

// global state
export const loggedInUserVar = makeVar<LoggedInUser>(undefined);

export const clinicListsVar = makeVar<IClinicList[]>([]); // member의 activated key를 저장하기 위해서 필요함.

export const selectedDateVar = makeVar(new Date());

export const selectedReservationVar =
  makeVar<SelectedReservationType>(undefined);

export const selectedPatientVar = makeVar<SelectedPatientType>(undefined);

export const toastVar = makeVar<ToastState>({});

// Timetable state
export const hasTableDisplayVar = makeVar(false);

export const tableDisplayVar = makeVar<TableDisplayOptions>(TableDisplay.value);

export const tableTimeVar = makeVar<TableTimeOptions>(TableTime.value);
