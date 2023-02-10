import {
  PRIVATE_LOCAL_STORAGE_KEY_VALUE,
  PUBLIC_LOCAL_STORAGE_KEY_VALUE,
} from '../utils/localStorage.utils';
import type { UserIdAndName, Value } from './common.types';

type PrivateLocalStorageKey = keyof typeof PRIVATE_LOCAL_STORAGE_KEY_VALUE;

type PublicLocalStorageKey = keyof typeof PUBLIC_LOCAL_STORAGE_KEY_VALUE;

export type LocalStorageType = typeof PUBLIC_LOCAL_STORAGE_KEY_VALUE &
  typeof PRIVATE_LOCAL_STORAGE_KEY_VALUE;

export type LocalStorageKey = keyof LocalStorageType;

// CREATE
export interface GenerateStorageKey extends Partial<UserIdAndName> {
  key: PrivateLocalStorageKey | PublicLocalStorageKey;
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

export type RemovePrivateLocalStorage = GetPrivateStorage;
export type RemovePublicLocalStorage = GetPublicLocalStorage;
