import { changeValueInArray, parseJsonOrString } from './commonUtils';
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
} from '../types/localStorageTypes';
import type {
  ClinicIdAndHiddenUsers,
  HiddenUsersArr,
} from '../types/storeTypes';
import type { UserIdAndName } from '../types/commonTypes';

class LocalStorage {
  #storageKeyObj: LocalStorageType;

  constructor(storageKeyObj: LocalStorageType) {
    this.#storageKeyObj = storageKeyObj;
  }

  // 로그인 유저의 id와 name이다.
  get<T>({
    key,
    id,
    name,
  }: GetPrivateStorage | GetPublicLocalStorage): T | null {
    const storageKey = this.#generateKey({ key, id, name });
    const item = localStorage.getItem(storageKey);
    if (!item || item === 'undefined') return null;

    return parseJsonOrString(item);
  }

  // 로그인 유저의 id와 name이다.
  set({ key, id, name, value }: SetPrivateStorage | SetPublicStorage) {
    const storageKey = this.#generateKey({ key, id, name });
    localStorage.setItem(storageKey, JSON.stringify(value));
  }

  // 로그인 유저의 id와 name이다.
  remove({
    key,
    id,
    name,
  }: RemovePrivateLocalStorage | RemovePublicLocalStorage) {
    const storageKey = this.#generateKey({ key, id, name });
    localStorage.removeItem(storageKey);
  }

  removeAll(user: UserIdAndName) {
    this.#removeAllOfPublic();
    this.#removeAllOfPrivate(user);
  }

  #removeAllOfPublic() {
    Object.keys(PUBLIC_LOCAL_STORAGE_KEY_VALUE).forEach((key) => {
      if (key === 'token' || key === 'createdAt') return;
      this.remove({ key: key as PublicLocalStorageKey });
    });
  }

  #removeAllOfPrivate(user: UserIdAndName) {
    Object.keys(PRIVATE_LOCAL_STORAGE_KEY_VALUE).forEach((key) => {
      this.remove({
        ...user,
        key: key as PrivateLocalStorageKey,
      });
    });
  }

  #generateKey({ key, id, name }: GenerateStorageKey) {
    if (id && name) {
      return `${this.#storageKeyObj[key]}-${id}-${name}`;
    }
    return this.#storageKeyObj[key];
  }
}

export const PRIVATE_LOCAL_STORAGE_KEY_VALUE = {
  clinicLists: 'physio-desk-clinic-lists',
  viewOption: 'physio-desk-view-option',
  tableTime: 'physio-desk-table-time',
  pickedClinicId: 'physio-desk-picked-clinic-id',
  showCancelOfTimetable: 'physio-desk-show-cancel-of-timetable',
  showNoshowOfTimetable: 'physio-desk-show-noshow-of-timetable',
  hiddenUsers: 'physio-desk-hidden-users',
} as const;

export const PUBLIC_LOCAL_STORAGE_KEY_VALUE = {
  token: 'physio-desk-token',
  createdAt: 'physio-desk-createdAt',
  isBigGlobalAside: 'physio-desk-is-big-global-aside',
  isWeekCalendar: 'physio-desk-is-week-calendar',
} as const;

export const LOCAL_STORAGE_KEY_VALUE = {
  ...PRIVATE_LOCAL_STORAGE_KEY_VALUE,
  ...PUBLIC_LOCAL_STORAGE_KEY_VALUE,
};

export const localStorageUtils = new LocalStorage(LOCAL_STORAGE_KEY_VALUE);

export const updateLocalStorageHiddenUsers = (
  hiddenUsers: HiddenUsersArr,
  clinicId: number,
  user: UserIdAndName
) => {
  let newHiddenUsers;

  const newClinicAndHiddenUser = [clinicId, hiddenUsers];

  const prevHiddenUsersArr = localStorageUtils.get<ClinicIdAndHiddenUsers[]>({
    key: 'hiddenUsers',
    ...user,
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
    ...user,
    value: newHiddenUsers,
  });
};
