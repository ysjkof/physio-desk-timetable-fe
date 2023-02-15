import { setHiddenUsers } from '../store';
import { localStorageUtils } from '../utils/localStorageUtils';
import type { UserIdAndName } from '../types/commonTypes';
import type { ClinicIdAndHiddenUsers } from '../types/storeTypes';

export const useHiddenUsers = () => {
  const initialize = (idAndName: UserIdAndName, clinicId: number) => {
    const localStorageData = localStorageUtils.get<ClinicIdAndHiddenUsers[]>({
      key: 'hiddenUsers',
      ...idAndName,
    });

    if (localStorageData === null) {
      return;
    }
    const hiddenUsers = localStorageData.find(
      ([_clinicId]) => _clinicId === clinicId
    );
    if (!hiddenUsers) return;

    setHiddenUsers(hiddenUsers[1]);
  };

  return { initialize };
};
