import { selectClinicId, setClinicId } from '../store';
import { localStorageUtils } from '../utils/localStorage.utils';
import { useMe } from './useMe';
import type { GetMyClinicsStatusQuery } from '../types/generated.types';

export const useSelectedClinicId = () => {
  const [, { getIdName }] = useMe();

  const initialize = (
    clinics: NonNullable<
      GetMyClinicsStatusQuery['getMyClinicsStatus']['clinics']
    >
  ) => {
    const idAndName = getIdName();

    const localStorageData = localStorageUtils.get<number>({
      key: 'selectedClinicId',
      ...idAndName,
    });

    if (localStorageData === null) {
      const clinicId = clinics.find((clinic) => clinic.isPersonal)?.id;
      if (!clinicId)
        throw new Error('initSelectedClinicId >> clinicId가 없습니다.');

      selectClinicId({ clinicId, ...idAndName });
      return;
    }
    setClinicId(localStorageData);
  };

  return { initialize };
};
