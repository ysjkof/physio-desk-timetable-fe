const SELECTED_CLINIC = 'muool-selected-clinic-';

export const LOCAL_STORAGE_KEY = {
  token: 'muool-token',
  clinicLists: 'muool-clinic-lists-',
  viewOption: 'muool-view-option-',
  selectedClinic: SELECTED_CLINIC,
} as const;
export type LocalStorageKey = keyof typeof LOCAL_STORAGE_KEY;
export type LocalStorageValue = typeof LOCAL_STORAGE_KEY[LocalStorageKey];

export const SELECTED_LOCAL_STORAGE_KEY = {
  clinic: SELECTED_CLINIC,
  patient: '',
  reservation: '',
} as const;
