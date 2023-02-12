import { LATEST_STORAGE_VERSION } from '../constants/constants';
import { changeValueInArray } from './common.utils';
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
import type {
  ClinicIdAndHiddenUsers,
  HiddenUsersArr,
} from '../types/store.types';
import type { UserIdAndName } from '../types/common.types';

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
  hiddenUsers: 'muool-hidden-users',
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

export const updateLocalStorageHiddenUsers = ({
  hiddenUsers,
  clinicId,
  userId,
  userName,
}: {
  hiddenUsers: HiddenUsersArr;
  clinicId: number;
  userId: number;
  userName: string;
}) => {
  let newHiddenUsers;

  const newClinicAndHiddenUser = [clinicId, hiddenUsers];

  const prevHiddenUsersArr = localStorageUtils.get<ClinicIdAndHiddenUsers[]>({
    key: 'hiddenUsers',
    userId,
    userName,
  });

  const clinicIdx = prevHiddenUsersArr?.findIndex(
    ([_clinicId]) => _clinicId === clinicId
  );

  if (!prevHiddenUsersArr) {
    newHiddenUsers = [newClinicAndHiddenUser];
  }

  if (prevHiddenUsersArr && clinicIdx === -1) {
    newHiddenUsers = [...prevHiddenUsersArr, newClinicAndHiddenUser];
  }

  if (prevHiddenUsersArr && clinicIdx !== -1) {
    newHiddenUsers = changeValueInArray(
      prevHiddenUsersArr,
      newClinicAndHiddenUser,
      clinicIdx || 0
    );
  }

  localStorageUtils.set({
    key: 'hiddenUsers',
    userId,
    userName,
    value: newHiddenUsers,
  });
};
