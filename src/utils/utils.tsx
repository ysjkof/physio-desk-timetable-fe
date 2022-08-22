import { LOCAL_STORAGE_KEY } from '../constants/localStorage';
import { clinicListsVar, viewOptionsVar } from '../store';
import {
  CreateLocalStorageKey,
  GetLocalStorage,
  IClinicList,
  IViewOption,
  SetLocalStorage,
} from '../types/type';

export function cls(...classnames: string[]) {
  return classnames.join(' ');
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

export function saveClinicLists(
  clinicList: IClinicList[],
  loginUserId: number
) {
  localStorage.setItem(
    LOCAL_STORAGE_KEY.CLINIC_LISTS + loginUserId,
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
    LOCAL_STORAGE_KEY.VIEW_OPTION + loggedInUserId,
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

export const createLocalStorageKey = ({
  key,
  userId,
  userName,
}: CreateLocalStorageKey) => {
  return key + userId + userName;
};

export function getLocalStorageItem<T>({
  key,
  userId,
  userName,
}: GetLocalStorage): T | null {
  const storageKey = createLocalStorageKey({
    key: LOCAL_STORAGE_KEY[key],
    userId,
    userName,
  });
  const item = localStorage.getItem(storageKey)!;
  if (!item) return null;
  return JSON.parse(item);
}

export const setLocalStorage = ({
  key,
  userId,
  userName,
  value,
}: SetLocalStorage) => {
  const storageKey = createLocalStorageKey({
    key: LOCAL_STORAGE_KEY[key],
    userId,
    userName,
  });
  localStorage.setItem(storageKey, JSON.stringify(value));
};
