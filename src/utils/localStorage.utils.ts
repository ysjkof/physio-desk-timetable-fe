import type {
  GenerateStorageKey,
  GetPrivateStorage,
  GetPublicLocalStorage,
  LocalStorageType,
  RemovePrivateLocalStorage,
  RemovePublicLocalStorage,
  SetPrivateStorage,
  SetPublicStorage,
} from '../types/localStorage.types';

class LocalStorage {
  #storageKeyObj: LocalStorageType;

  constructor(storageKeyObj: LocalStorageType) {
    this.#storageKeyObj = storageKeyObj;
  }

  get<T>({
    key,
    userId,
    userName,
  }: GetPrivateStorage | GetPublicLocalStorage): T | null {
    const storageKey = this.#generateKey({
      key,
      userId,
      userName,
    });
    const item = localStorage.getItem(storageKey);
    if (!item || item === 'undefined') return null;
    return JSON.parse(item);
  }

  set({ key, userId, userName, value }: SetPrivateStorage | SetPublicStorage) {
    const storageKey = this.#generateKey({
      key,
      userId,
      userName,
    });
    localStorage.setItem(storageKey, JSON.stringify(value));
  }

  remove({
    key,
    userId,
    userName,
  }: RemovePrivateLocalStorage | RemovePublicLocalStorage) {
    const storageKey = this.#generateKey({
      key,
      userId,
      userName,
    });
    localStorage.removeItem(storageKey);
  }

  #generateKey({ key, userId, userName }: GenerateStorageKey) {
    if (userId && userName) {
      return `${this.#storageKeyObj[key]}-${userId}-${userName}`;
    }
    return this.#storageKeyObj[key];
  }
}

export const PRIVATE_LOCAL_STORAGE_KEY_VALUE = {
  clinicLists: 'muool-clinic-lists',
  viewOption: 'muool-view-option',
  tableTime: 'muool-table-time',
  selectedClinicId: 'muool-selected-clinic-id',
  showCancelOfTimetable: 'muool-show-cancel-of-timetable',
  showNoshowOfTimetable: 'muool-show-noshow-of-timetable',
} as const;

export const PUBLIC_LOCAL_STORAGE_KEY_VALUE = {
  token: 'muool-token',
  createdAt: 'muool-local-storage-createdAt',
  isBigGlobalAside: 'muool-is-big-global-aside',
} as const;

export const LOCAL_STORAGE_KEY_VALUE = {
  ...PRIVATE_LOCAL_STORAGE_KEY_VALUE,
  ...PUBLIC_LOCAL_STORAGE_KEY_VALUE,
};

export default new LocalStorage(LOCAL_STORAGE_KEY_VALUE);
