const SELECTED_CLINIC = 'muool-selected-clinic-';

/**
 * 사용하는 로컬스토리지 키는 이곳에서 관리
 */
export const LOCAL_STORAGE_KEY = {
  token: 'muool-token',
  clinicLists: 'muool-clinic-lists-',
  viewOption: 'muool-view-option-',
  selectedClinic: SELECTED_CLINIC,
  createdAt: 'muool-local-storage-createdAt-',
} as const;

export type LocalStorageKey = keyof typeof LOCAL_STORAGE_KEY;
export type LocalStorageValue = typeof LOCAL_STORAGE_KEY[LocalStorageKey];
