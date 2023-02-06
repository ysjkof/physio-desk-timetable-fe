import { useQuery } from '@apollo/client';
import { PropsWithChildren, useEffect, useState } from 'react';
import { LATEST_STORAGE_VERSION } from '../constants/constants';
import { FIND_MY_CLINICS_DOCUMENT } from '../graphql';
import { ClinicsOfClient, TableDisplay, TableTime } from '../models';
import localStorageUtils from '../utils/localStorage.utils';
import {
  clinicListsVar,
  loggedInUserVar,
  tableDisplayVar,
  tableTimeVar,
} from '../store';
import { useMe } from '../hooks';
import type { MyClinic, UserIdAndName } from '../types/common.types';
import type { FindMyClinicsQuery } from '../types/generated.types';

const Initialize = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true);

  const { data: meData } = useMe();

  const { data: findMyClinicsData } = useQuery<FindMyClinicsQuery>(
    FIND_MY_CLINICS_DOCUMENT,
    {
      variables: { input: { includeInactivate: true } },
    }
  );

  const checkLatestStorage = (userIdAndName: UserIdAndName) => {
    const localCreatedAt = localStorageUtils.get<string>({
      key: 'createdAt',
    });

    const createdAt = localCreatedAt ? new Date(localCreatedAt) : null;

    const latestCreatedAt = new Date(LATEST_STORAGE_VERSION);

    if (createdAt && createdAt.getTime() >= latestCreatedAt.getTime()) return;

    localStorageUtils.remove({ ...userIdAndName, key: 'clinicLists' });
    localStorageUtils.remove({ ...userIdAndName, key: 'viewOption' });

    localStorageUtils.set({
      key: 'createdAt',
      value: latestCreatedAt,
    });
    return console.info('Initialized New Local Storage');
  };

  const initTableDisplay = (userIdAndName: UserIdAndName) => {
    const tableDisplayOptions = TableDisplay.initialize(userIdAndName);
    tableDisplayVar(tableDisplayOptions);
  };

  const initTableTime = (userIdAndName: UserIdAndName) => {
    const tableTimeOptions = TableTime.initialize(userIdAndName);
    tableTimeVar(tableTimeOptions);
  };

  const initClinicsOfClient = (
    userIdAndName: UserIdAndName,
    clinics: MyClinic[]
  ) => {
    const myClinics = ClinicsOfClient.initialize(userIdAndName, clinics);
    clinicListsVar(myClinics);
  };

  useEffect(() => {
    setLoading(true);

    if (!meData || !findMyClinicsData?.findMyClinics.clinics) return;

    const userIdAndName = { userId: meData.me.id, userName: meData.me.name };

    checkLatestStorage(userIdAndName);

    initTableDisplay(userIdAndName);
    initTableTime(userIdAndName);
    initClinicsOfClient(userIdAndName, findMyClinicsData.findMyClinics.clinics);

    loggedInUserVar(meData.me);

    setLoading(false);
  }, [meData, findMyClinicsData]);

  if (loading) return <></>;

  return <>{children}</>;
};

export default Initialize;
