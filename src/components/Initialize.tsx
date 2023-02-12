import { type PropsWithChildren, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MY_CLINICS_STATUS_DOCUMENT } from '../graphql';
import { checkAndRefreshLatestStorage } from '../utils/localStorage.utils';
import { useMe, useSelectedClinicId } from '../hooks';
import { useTimeDurationOfTimetable } from '../pages/timetable/hooks';
import type { GetMyClinicsStatusQuery } from '../types/generated.types';

const Initialize = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true);

  const [meData, { getIdName }] = useMe();

  const { data: myClinicsStatusData } = useQuery<GetMyClinicsStatusQuery>(
    GET_MY_CLINICS_STATUS_DOCUMENT
  );

  const { initialize: initSelectedClinicId } = useSelectedClinicId();
  const { initialize: initTimeDuration } = useTimeDurationOfTimetable();

  useEffect(() => {
    setLoading(true);

    if (!meData || !myClinicsStatusData?.getMyClinicsStatus.clinics) return;

    checkAndRefreshLatestStorage(getIdName());
    initSelectedClinicId(myClinicsStatusData.getMyClinicsStatus.clinics);
    initTimeDuration();

    setLoading(false);
  }, [meData, myClinicsStatusData]);

  if (loading) return <></>;

  return <>{children}</>;
};

export default Initialize;
