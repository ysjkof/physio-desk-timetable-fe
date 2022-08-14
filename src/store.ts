import { makeVar } from '@apollo/client';
import { VIEW_PERIOD } from './constants/constants';
import { IClinicList, IViewOption, SelectedInfo } from './types/type';

const defaultViewOptions: IViewOption = {
  viewPeriod: VIEW_PERIOD.ONE_WEEK,
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
export const viewOptionsVar = makeVar<IViewOption>(defaultViewOptions);
export const clinicListsVar = makeVar<IClinicList[]>([]); // member의 activated key를 저장하기 위해서 필요함.

export const selectedInfoVar = makeVar<SelectedInfo>({
  date: new Date(),
  clinic: null,
  patient: null,
  reservation: null,
});
