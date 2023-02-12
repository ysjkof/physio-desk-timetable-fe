import { LATEST_STORAGE_VERSION } from '../constants/constants';
import type { UserIdAndName } from '../types/common.types';
import type {
  GenerateStorageKey,
  GetPrivateStorage,
  GetPublicLocalStorage,
  LocalStorageType,
  PrivateLocalStorageKey,
  PublicLocalStorageKey,
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

  removeAll(userIdAndName: UserIdAndName) {
    this.#removeAllOfPublic();
    this.#removeAllOfPrivate(userIdAndName);
  }

  #removeAllOfPublic() {
    Object.keys(PUBLIC_LOCAL_STORAGE_KEY_VALUE).forEach((key) => {
      if (key === 'token' || key === 'createdAt') return;
      this.remove({ key: key as PublicLocalStorageKey });
    });
  }

  #removeAllOfPrivate(userIdAndName: UserIdAndName) {
    Object.keys(PRIVATE_LOCAL_STORAGE_KEY_VALUE).forEach((key) => {
      this.remove({
        ...userIdAndName,
        key: key as PrivateLocalStorageKey,
      });
    });
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
  createdAt: 'muool-createdAt',
  isBigGlobalAside: 'muool-is-big-global-aside',
} as const;

export const LOCAL_STORAGE_KEY_VALUE = {
  ...PRIVATE_LOCAL_STORAGE_KEY_VALUE,
  ...PUBLIC_LOCAL_STORAGE_KEY_VALUE,
};

export const localStorageUtils = new LocalStorage(LOCAL_STORAGE_KEY_VALUE);

export const checkAndRefreshLatestStorage = (userIdAndName: UserIdAndName) => {
  if (isLatestStorage()) return;

  localStorageUtils.removeAll(userIdAndName);

  localStorageUtils.set({
    key: 'createdAt',
    value: LATEST_STORAGE_VERSION,
  });
  return console.info('Refresh Local Storage');
};

const isLatestStorage = () => {
  const localCreatedAt = localStorageUtils.get<string>({
    key: 'createdAt',
  });
  const createdAt = localCreatedAt && new Date(localCreatedAt);
  return !!(
    createdAt && createdAt.getTime() >= LATEST_STORAGE_VERSION.getTime()
  );
};
