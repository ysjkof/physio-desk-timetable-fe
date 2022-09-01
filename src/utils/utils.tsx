import { LOCAL_STORAGE_KEY } from '../constants/localStorage';
import { ClinicType } from '../graphql/generated/graphql';
import {
  CreateLocalStorageKey,
  GetLocalStorage,
  GetTokenLocalStorage,
  RemoveTokenLocalStorage,
  SetLocalStorage,
  SetTokenLocalStorage,
} from '../types/type';

export function cls(...classnames: string[]) {
  return classnames.join(' ');
}

export function getPositionRef(
  ref: React.RefObject<HTMLDivElement>,
  modalGap: number
) {
  const height = ref.current?.getBoundingClientRect().height ?? 0;
  const top =
    ref.current?.getBoundingClientRect().top! + height + modalGap ?? 0;
  const left = ref.current?.getBoundingClientRect().left ?? 0;
  return { top, left };
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
  if (userId && userName) {
    return key + userId + '-' + userName;
  }
  return key;
};

export function getLocalStorageItem<T>({
  key,
  userId,
  userName,
}: GetLocalStorage | GetTokenLocalStorage): T | null {
  const storageKey = createLocalStorageKey({
    key: LOCAL_STORAGE_KEY[key],
    userId,
    userName,
  });
  const item = localStorage.getItem(storageKey)!;
  if (!item) return null;
  return JSON.parse(item);
}

export function removeLocalStorageItem<T>({
  key,
  userId,
  userName,
}: GetLocalStorage | RemoveTokenLocalStorage) {
  const storageKey = createLocalStorageKey({
    key: LOCAL_STORAGE_KEY[key],
    userId,
    userName,
  });
  localStorage.removeItem(storageKey)!;
}

export const setLocalStorage = ({
  key,
  userId,
  userName,
  value,
}: SetLocalStorage | SetTokenLocalStorage) => {
  const storageKey = createLocalStorageKey({
    key: LOCAL_STORAGE_KEY[key],
    userId,
    userName,
  });
  localStorage.setItem(storageKey, JSON.stringify(value));
};

const removePersonalClinicNumber = (name: string) => {
  const splitted = name.split(':');
  return splitted.length < 2 ? null : splitted[0];
};
export const renameUseSplit = (name: string) => {
  const isSplit = removePersonalClinicNumber(name);
  return isSplit ? isSplit + ' : 개인' : name;
};
