import { type PropsWithChildren, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { setUser, useStore } from '../../store';
import {
  checkAndRefreshLatestStorage,
  initHiddenUsers,
  initPickedClinicId,
  initTimeDurationOfTimetable,
  loadIsBigGlobalAside,
  loadIsWeekCalendar,
  loadShowCancel,
  loadShowNoshow,
} from './initializeUtils';
import { useMe } from '../../hooks';
import { GET_MY_CLINICS_STATUS_DOCUMENT } from '../../graphql';
import type { GetMyClinicsStatusQuery } from '../../types/generatedTypes';

const Initialize = ({ children }: PropsWithChildren) => {
  useStore((state) => state.pickedClinicId); // 리렌더용
  const [loading, setLoading] = useState(true);

  const [meData] = useMe();

  const { data: myClinicsStatusData } = useQuery<GetMyClinicsStatusQuery>(
    GET_MY_CLINICS_STATUS_DOCUMENT
  );

  useEffect(() => {
    setLoading(true);

    const personalClinicId =
      myClinicsStatusData?.getMyClinicsStatus.clinics?.find(
        (clinic) => clinic.isPersonal
      )?.id;

    if (!meData || !personalClinicId) return;

    checkAndRefreshLatestStorage();

    const user = { id: meData.id, name: meData.name };
    setUser(user);
    initPickedClinicId(user, personalClinicId);
    initTimeDurationOfTimetable(user);
    initHiddenUsers(user);
    loadShowCancel(user);
    loadShowNoshow(user);
    loadIsWeekCalendar();
    loadIsBigGlobalAside();

    setLoading(false);
  }, [meData, myClinicsStatusData]);

  if (loading) return <></>;

  return <>{children}</>;
};

export default Initialize;
