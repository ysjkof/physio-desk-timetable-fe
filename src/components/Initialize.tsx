import { type PropsWithChildren, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MY_CLINICS_STATUS_DOCUMENT } from '../graphql';
import { localStorageUtils } from '../utils/localStorage.utils';
import { useMe, useSelectedClinicId, useSetHiddenUsers } from '../hooks';
import { useTimeDurationOfTimetable } from '../pages/timetable/hooks';
import { LATEST_STORAGE_VERSION } from '../constants/constants';
import { useStore } from '../store';
import type { UserIdAndName } from '../types/common.types';
import type { GetMyClinicsStatusQuery } from '../types/generated.types';

const Initialize = ({ children }: PropsWithChildren) => {
  useStore((state) => state.selectedClinicId); // 리렌더용
  const [loading, setLoading] = useState(true);

  const [, { getIdName }] = useMe();

  const { data: myClinicsStatusData } = useQuery<GetMyClinicsStatusQuery>(
    GET_MY_CLINICS_STATUS_DOCUMENT
  );

  const { initialize: initSelectedClinicId } = useSelectedClinicId();
  const { initialize: initTimeDuration } = useTimeDurationOfTimetable();
  const { initialize: initHiddenUsers } = useSetHiddenUsers();

  useEffect(() => {
    setLoading(true);

    if (!myClinicsStatusData?.getMyClinicsStatus.clinics) return;

    const clinicId = myClinicsStatusData?.getMyClinicsStatus.clinics.find(
      (clinic) => clinic.isPersonal
    )?.id;

    if (!clinicId) throw new Error('초기화 중 clinicId가 없습니다');

    const idAndName = getIdName();
    checkAndRefreshLatestStorage(idAndName);

    const selectedClinicId = initSelectedClinicId(idAndName, clinicId);
    initHiddenUsers(idAndName, selectedClinicId);
    initTimeDuration(idAndName);

    setLoading(false);
  }, [myClinicsStatusData]);

  if (loading) return <></>;

  return <>{children}</>;
};

const checkAndRefreshLatestStorage = (userIdAndName: UserIdAndName) => {
  if (isLatestStorage()) return;

  localStorageUtils.removeAll(userIdAndName);

  localStorageUtils.set({
    key: 'createdAt',
    value: LATEST_STORAGE_VERSION,
  });
  return console.info('Refresh Local Storage');
};

const isLatestStorage = () => {
  const localCreatedAt = localStorageUtils.get<string>({
    key: 'createdAt',
  });
  const createdAt = localCreatedAt && new Date(localCreatedAt);
  return !!(
    createdAt && createdAt.getTime() >= LATEST_STORAGE_VERSION.getTime()
  );
};

export default Initialize;
