import type {
  GenerateStorageKey,
  GetPrivateStorage,
  GetPublicLocalStorage,
  LocalStorageKeysType,
  RemovePrivateLocalStorage,
  RemovePublicLocalStorage,
  SetPrivateStorage,
  SetPublicStorage,
} from '../types/localStorage.types';

class LocalStorage {
  #storageKeyObj;

  constructor(storageKeyObj: LocalStorageKeysType) {
    this.#storageKeyObj = storageKeyObj;
  }

  #generateKey({ key, userId, userName }: GenerateStorageKey) {
    if (userId && userName) {
      return key + userId + '-' + userName;
    }
    return key;
  }

  get<T>({
    key,
    userId,
    userName,
  }: GetPrivateStorage | GetPublicLocalStorage): T | null {
    const storageKey = this.#generateKey({
      key: this.#storageKeyObj[key],
      userId,
      userName,
    });
    const item = localStorage.getItem(storageKey);
    if (!item || item === 'undefined') return null;

    return JSON.parse(item);
  }

  set({ key, userId, userName, value }: SetPrivateStorage | SetPublicStorage) {
    const storageKey = this.#generateKey({
      key: this.#storageKeyObj[key],
      userId,
      userName,
    });
    localStorage.setItem(storageKey, JSON.stringify(value));
  }

  remove<T>({
    key,
    userId,
    userName,
  }: RemovePrivateLocalStorage | RemovePublicLocalStorage) {
    const storageKey = this.#generateKey({
      key: this.#storageKeyObj[key],
      userId,
      userName,
    });
    localStorage.removeItem(storageKey)!;
  }
}

export const LOCAL_STORAGE_KEY = {
  token: 'muool-token',
  createdAt: 'muool-local-storage-createdAt',
  clinicLists: 'muool-clinic-lists-',
  viewOption: 'muool-view-option-',
  tableTime: 'muool-table-time-',
  selectedClinic: 'muool-selected-clinic-',
} as const;

export default new LocalStorage(LOCAL_STORAGE_KEY);
