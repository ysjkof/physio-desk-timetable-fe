import {
  CreateStorageKey,
  GetPrivateStorage,
  GetPublicLocalStorage,
  RemovePrivateLocalStorage,
  RemovePublicLocalStorage,
  SetPrivateStorage,
  SetPublicStorage,
} from '../types/localStorageType';

export const LOCAL_STORAGE_KEY = {
  token: 'muool-token',
  clinicLists: 'muool-clinic-lists-',
  viewOption: 'muool-view-option-',
  selectedClinic: 'muool-selected-clinic-',
  createdAt: 'muool-local-storage-createdAt-',
} as const;

export const createStorageKey = ({
  key,
  userId,
  userName,
}: CreateStorageKey) => {
  if (userId && userName) {
    return key + userId + '-' + userName;
  }
  return key;
};

export function getStorage<T>({
  key,
  userId,
  userName,
}: GetPrivateStorage | GetPublicLocalStorage): T | null {
  const storageKey = createStorageKey({
    key: LOCAL_STORAGE_KEY[key],
    userId,
    userName,
  });
  const item = localStorage.getItem(storageKey);
  if (!item || item === 'undefined') return null;

  return JSON.parse(item);
}

export const setStorage = ({
  key,
  userId,
  userName,
  value,
}: SetPrivateStorage | SetPublicStorage) => {
  const storageKey = createStorageKey({
    key: LOCAL_STORAGE_KEY[key],
    userId,
    userName,
  });
  localStorage.setItem(storageKey, JSON.stringify(value));
};

export function removeStorage<T>({
  key,
  userId,
  userName,
}: RemovePrivateLocalStorage | RemovePublicLocalStorage) {
  const storageKey = createStorageKey({
    key: LOCAL_STORAGE_KEY[key],
    userId,
    userName,
  });
  localStorage.removeItem(storageKey)!;
}
