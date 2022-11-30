import { LOCAL_STORAGE_KEY } from '../utils/localStorage.utils';
import type { UserIdAndName, Value } from './common.types';

type PrivateLocalStorageKey = keyof Pick<
  typeof LOCAL_STORAGE_KEY,
  'clinicLists' | 'viewOption' | 'tableTime'
>;

type PublicLocalStorageKey = keyof Pick<
  typeof LOCAL_STORAGE_KEY,
  'token' | 'createdAt'
>;

export type LocalStorageKeysType = typeof LOCAL_STORAGE_KEY;
export type LocalStorageKey = keyof LocalStorageKeysType;
export type LocalStorageValue = typeof LOCAL_STORAGE_KEY[LocalStorageKey];

// CREATE
export interface GenerateStorageKey extends Partial<UserIdAndName> {
  key: LocalStorageValue;
}

//

export interface CreatedAt {
  createdAt: Date;
}

// GET

export interface GetPrivateStorage extends UserIdAndName {
  key: PrivateLocalStorageKey;
}
export interface GetPublicLocalStorage extends Partial<UserIdAndName> {
  key: PublicLocalStorageKey;
}

// SET
export interface SetPrivateStorage extends GetPrivateStorage, Value {}
export interface SetPublicStorage extends GetPublicLocalStorage, Value {}

// DELETE

export interface RemovePrivateLocalStorage extends GetPrivateStorage {}
export interface RemovePublicLocalStorage extends GetPublicLocalStorage {}
