import { useQuery } from '@apollo/client';
import { PropsWithChildren, useEffect, useState } from 'react';
import { LATEST_STORAGE_VERSION } from '../constants/constants';
import { FIND_MY_CLINICS_DOCUMENT, ME_DOCUMENT } from '../graphql';
import { ClinicsOfClient, TableDisplay, TableTime } from '../models';
import {
  clinicListsVar,
  loggedInUserVar,
  tableDisplayVar,
  tableTimeVar,
} from '../store';
import { MyClinic, UserIdAndName } from '../types/common.types';
import { FindMyClinicsQuery, MeQuery } from '../types/generated.types';
import localStorageUtils from '../utils/localStorageUtils';

export function Initialize({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);

  const { data: meData } = useQuery<MeQuery>(ME_DOCUMENT);

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

  const initTableDisplay = () => {
    const localViewOptions = TableDisplay.getFromLocalStorage();
    if (localViewOptions === null) {
      return TableDisplay.saveToLocalStorage(TableDisplay.value);
    }
    TableDisplay.setValue(localViewOptions);
    tableDisplayVar(localViewOptions);
  };

  const initTableTime = () => {
    const localTableTime = TableTime.getFromLocalStorage();
    if (localTableTime === null) {
      return TableTime.saveToLocalStorage(TableTime.value);
    }
    TableTime.setValue(localTableTime);
    tableTimeVar(localTableTime);
  };

  const initClinicsOfClient = (clinics: MyClinic[]) => {
    const localClinics = ClinicsOfClient.getFromLocalStorage();
    const latestClinics = ClinicsOfClient.createClinicsOfClient(clinics);
    if (localClinics === null) {
      ClinicsOfClient.saveToLocalStorage(latestClinics);
      return;
    }

    const updatedMyClinics = latestClinics.map((latestClinic) => {
      const localClinic = localClinics.find(
        (_localClinic) => _localClinic.id === latestClinic.id
      );
      return localClinic
        ? ClinicsOfClient.combineClinic(latestClinic, localClinic)
        : latestClinic;
    });

    ClinicsOfClient.setValue(updatedMyClinics);
    clinicListsVar(updatedMyClinics);
  };

  useEffect(() => {
    setLoading(true);

    if (!meData || !findMyClinicsData?.findMyClinics.clinics) return;

    const userIdAndName = { userId: meData.me.id, userName: meData.me.name };

    checkLatestStorage(userIdAndName);

    TableDisplay.initialize(userIdAndName);
    initTableDisplay();

    TableTime.initialize(userIdAndName);
    initTableTime();

    ClinicsOfClient.initialize(userIdAndName);
    initClinicsOfClient(findMyClinicsData.findMyClinics.clinics);

    loggedInUserVar(meData.me);

    setLoading(false);
  }, [meData, findMyClinicsData]);

  if (loading) return <></>;

  return <>{children}</>;
}
