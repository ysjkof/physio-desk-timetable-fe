import { makeVar } from '@apollo/client';
import { VIEW_PERIOD } from './constants/constants';
import { TableTime, TableTimeOptions } from './models/TableTime';
import {
  IClinicList,
  IViewOption,
  LoggedInUser,
  SelectedInfo,
  ToastState,
} from './types/common.types';

const defaultViewOptions: IViewOption = {
  viewPeriod: VIEW_PERIOD.ONE_WEEK,
  seeCancel: true,
  seeNoshow: true,
  seeList: false,
  seeActiveOption: false,
  navigationExpand: false,
};

// global state
export const loggedInUserVar = makeVar<LoggedInUser>(undefined);
export const viewOptionsVar = makeVar<IViewOption>(defaultViewOptions);
export const tableTimeVar = makeVar<TableTimeOptions>(TableTime.time);
export const clinicListsVar = makeVar<IClinicList[]>([]); // member의 activated key를 저장하기 위해서 필요함.

export const selectedDateVar = makeVar(new Date());
export const selectedInfoVar = makeVar<SelectedInfo>({
  clinic: null,
  patient: null,
  reservation: null,
});

export const toastVar = makeVar<ToastState>({});
