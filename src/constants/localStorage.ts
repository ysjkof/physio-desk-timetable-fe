const SELECTED_CLINIC = 'muool-selected-clinic-';

export const LOCAL_STORAGE_KEY = {
  TOKEN: 'muool-token',
  CLINIC_LISTS: 'muool-clinic-lists-',
  VIEW_OPTION: 'muool-view-option-',
  SELECTED_CLINIC: SELECTED_CLINIC,
} as const;
export type LocalStorageKey = keyof typeof LOCAL_STORAGE_KEY;
export type LocalStorageValue = typeof LOCAL_STORAGE_KEY[LocalStorageKey];

export const SELECTED_LOCAL_STORAGE_KEY = {
  clinic: SELECTED_CLINIC,
  patient: '',
  reservation: '',
} as const;
