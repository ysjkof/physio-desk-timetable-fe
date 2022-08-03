import {
  clinicListsVar,
  IClinicList,
  IViewOption,
  ISelectedClinic,
  selectedClinicVar,
  viewOptionsVar,
} from '../store';
import {
  LOCALSTORAGE_SELECTED_CLINIC,
  LOCALSTORAGE_CLINIC_LISTS,
  LOCALSTORAGE_VIEW_OPTION,
} from '../variables';

export function cls(...classnames: string[]) {
  return classnames.join(' ');
}

export function getDateFromYMDHM(
  startDateYear: number,
  startDateMonth: number,
  startDateDate: number,
  startDateHours?: number,
  startDateMinutes?: number
) {
  const MM = String(startDateMonth).padStart(2, '0');
  const DD = String(startDateDate).padStart(2, '0');
  const ymd = `${startDateYear}-${MM}-${DD}`;
  let hms = `T00:00:00.000`;
  if (
    typeof startDateHours === 'number' &&
    typeof startDateMinutes === 'number'
  ) {
    const HH = String(startDateHours).padStart(2, '0');
    const MM = String(startDateMinutes).padStart(2, '0');
    hms = `T${HH}:${MM}:00.000`;
  }
  return new Date(ymd + hms);
}

export function getPositionRef(
  ref: React.RefObject<HTMLDivElement>,
  modalGap: number
): [top: number, left: number] {
  const height = ref.current?.getBoundingClientRect().height ?? 0;
  const top =
    ref.current?.getBoundingClientRect().top! + height + modalGap ?? 0;
  const left = ref.current?.getBoundingClientRect().left ?? 0;
  return [top, left];
}

export function saveSelectedClinic(
  newSelectedClinic: ISelectedClinic,
  loggedInUserId: number
) {
  localStorage.setItem(
    LOCALSTORAGE_SELECTED_CLINIC + loggedInUserId,
    JSON.stringify(newSelectedClinic)
  );
  selectedClinicVar(newSelectedClinic);
}
export function saveClinicLists(
  clinicList: IClinicList[],
  loginUserId: number
) {
  localStorage.setItem(
    LOCALSTORAGE_CLINIC_LISTS + loginUserId,
    JSON.stringify(clinicList)
  );
  clinicListsVar(clinicList);
}
export function saveViewOptions(
  newViewOptions: IViewOption,
  loggedInUserId: number,
  newViewOptionsForLacal?: IViewOption
) {
  localStorage.setItem(
    LOCALSTORAGE_VIEW_OPTION + loggedInUserId,
    JSON.stringify(
      newViewOptionsForLacal ? newViewOptionsForLacal : newViewOptions
    )
  );
  viewOptionsVar(newViewOptions);
}

export function checkMember(staying: boolean, accepted: boolean) {
  if (!staying) {
    return accepted ? '탈퇴' : '수락대기';
  } else {
    return accepted ? '직원' : null;
  }
  // if (staying && accepted) return "직원";
  // if (!staying && !accepted) return "수락대기";
  // if (!staying && accepted) return "탈퇴";
}

export function makeArrFromLength(length: number) {
  const arr: number[] = [];
  arr.length = length;
  arr.fill(0);
  return arr;
}

export function getHowManyDayFromMillisec(millisecond: number) {
  // MILLISECOND_TO_DAY = 1000 / 60 / 60 / 24
  return millisecond / 1000 / 60 / 60 / 24;
}
// export function makeStartDate(date: Date, howManyDay: number) {
//   const millisecondToDay = getHowManyDayFromMillisec(date.getTime());
//   return new Date(millisecondToDay / howManyDay);
// }

export function getRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

export const removeItemInArrayByIndex = (index: number, array: any[]) => [
  ...array.slice(0, index),
  ...array.slice(index + 1),
];

export function changeValueInArray<T>(array: T[], value: T, index: number) {
  return [...array.slice(0, index), value, ...array.slice(index + 1)];
}
