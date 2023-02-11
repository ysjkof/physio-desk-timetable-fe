import { selectClinicId } from '../../store';
import { UserIdAndName } from '../../types/common.types';
import localStorageUtils from '../../utils/localStorage.utils';
import type { GetMyClinicsStatusQuery } from '../../types/generated.types';

export const initSelectedClinicId = (
  userIdAndName: UserIdAndName,
  clinics: NonNullable<GetMyClinicsStatusQuery['getMyClinicsStatus']['clinics']>
) => {
  const localStorageData = localStorageUtils.get<number>({
    key: 'selectedClinicId',
    ...userIdAndName,
  });

  if (localStorageData === null) {
    const clinicId = clinics.find((clinic) => clinic.isPersonal)?.id;
    if (!clinicId)
      throw new Error('initSelectedClinicId >> clinicId가 없습니다.');

    localStorageUtils.set({
      ...userIdAndName,
      key: 'selectedClinicId',
      value: clinicId,
    });
    selectClinicId(clinicId);
    return;
  }
  selectClinicId(localStorageData);
};
