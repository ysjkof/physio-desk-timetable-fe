import { pickClinicId, setClinicId } from '../store';
import { localStorageUtils } from '../utils/localStorage.utils';
import type { UserIdAndName } from '../types/common.types';

export const usePickedClinicId = () => {
  const initialize = (idAndName: UserIdAndName, clinicId: number) => {
    const localStorageData = localStorageUtils.get<number>({
      key: 'pickedClinicId',
      ...idAndName,
    });

    if (localStorageData === null) pickClinicId({ clinicId, ...idAndName });
    else setClinicId(localStorageData);
    return localStorageData || clinicId;
  };

  return { initialize };
};
