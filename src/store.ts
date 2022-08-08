import { makeVar } from '@apollo/client';
import { ListReservationsQuery } from './graphql/generated/graphql';
import { ONE_WEEK } from './constants/constants';
import {
  IClinicList,
  IListReservation,
  ISelectedClinic,
  IViewOption,
  ModifiedLoggedInUser,
  SelectedPatient,
} from './types/type';

const defaultViewOptions: IViewOption = {
  periodToView: ONE_WEEK,
  seeCancel: true,
  seeNoshow: true,
  seeList: false,
  seeActiveOption: false,
  navigationExpand: false,
  tableDuration: {
    start: { hours: 9, minutes: 0 },
    end: { hours: 19, minutes: 0 },
  },
};

// global state
export const queryResultVar = makeVar<ListReservationsQuery | undefined>(
  undefined
);

export const todayNowVar = makeVar<Date>(new Date());
export const loggedInUserVar = makeVar<ModifiedLoggedInUser | null>(null);

export const viewOptionsVar = makeVar<IViewOption>(defaultViewOptions);
export const clinicListsVar = makeVar<IClinicList[]>([]); // member의 activated key를 저장하기 위해서 필요함.

export const selectedDateVar = makeVar(new Date());
export const selectedClinicVar = makeVar<ISelectedClinic | null>(null);
export const selectedPatientVar = makeVar<null | SelectedPatient>(null);

export const selectedReservationVar = makeVar<null | IListReservation>(null);
