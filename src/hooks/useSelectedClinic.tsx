import { selectClinicId, setClinicId } from '../store';
import { localStorageUtils } from '../utils/localStorage.utils';
import type { UserIdAndName } from '../types/common.types';

export const useSelectedClinicId = () => {
  const initialize = (idAndName: UserIdAndName, clinicId: number) => {
    const localStorageData = localStorageUtils.get<number>({
      key: 'selectedClinicId',
      ...idAndName,
    });

    if (localStorageData === null) selectClinicId({ clinicId, ...idAndName });
    else setClinicId(localStorageData);
    return localStorageData || clinicId;
  };

  return { initialize };
};
