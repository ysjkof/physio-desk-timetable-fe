import {
  GenerateStorageKey,
  GetPrivateStorage,
  GetPublicLocalStorage,
  LocalStorageKeysType,
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

class LocalStorage {
  constructor(private readonly storagekeys: LocalStorageKeysType) {}

  private generateKey({ key, userId, userName }: GenerateStorageKey) {
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
    const storageKey = this.generateKey({
      key: this.storagekeys[key],
      userId,
      userName,
    });
    const item = localStorage.getItem(storageKey);
    if (!item || item === 'undefined') return null;

    return JSON.parse(item);
  }

  set({ key, userId, userName, value }: SetPrivateStorage | SetPublicStorage) {
    const storageKey = this.generateKey({
      key: this.storagekeys[key],
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
    const storageKey = this.generateKey({
      key: this.storagekeys[key],
      userId,
      userName,
    });
    localStorage.removeItem(storageKey)!;
  }
}

export default new LocalStorage(LOCAL_STORAGE_KEY);
