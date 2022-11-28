import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { IsLoggedIn } from '../_legacy_components/templates/GlobalLayout';
import {
  loggedInUserVar,
  tableTimeVar,
  tableDisplayVar,
  clinicListsVar,
} from '../store';
import localStorageUtils from '../utils/localStorageUtils';
import { ME_DOCUMENT, FIND_MY_CLINICS_DOCUMENT } from '../graphql';
import { TableTime, TableDisplay, ClinicsOfClient } from '../models';
import type { FindMyClinicsQuery, MeQuery } from '../types/generated.types';
import type { MyClinic, UserIdAndName } from '../types/common.types';

function useLoginInitialization({ isLoggedIn }: IsLoggedIn) {
  const [loading, setLoading] = useState(true);

  const [meQuery, { data: meData }] = useLazyQuery<MeQuery>(ME_DOCUMENT);

  const [findMyClinicsQuery, { data: findMyClinicsData }] =
    useLazyQuery<FindMyClinicsQuery>(FIND_MY_CLINICS_DOCUMENT, {
      variables: { input: { includeInactivate: true } },
    });

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

  const checkLatestStorage = (userIdAndName: UserIdAndName) => {
    const localCreatedAt = localStorageUtils.get<string>({
      key: 'createdAt',
    });

    const createdAt = localCreatedAt ? new Date(localCreatedAt) : null;

    const latestDateString = '2022-09-08T09:25:00.000Z';
    const latestCreatedAt = new Date(latestDateString);

    if (createdAt && createdAt.getTime() >= latestCreatedAt.getTime()) return;

    localStorageUtils.remove({ ...userIdAndName, key: 'clinicLists' });
    localStorageUtils.remove({ ...userIdAndName, key: 'viewOption' });

    localStorageUtils.set({
      key: 'createdAt',
      value: latestCreatedAt,
    });
    return console.info('Initialized Local Storage');
  };

  useEffect(() => {
    setLoading(true);
    if (!isLoggedIn) return;
    meQuery();
    findMyClinicsQuery();

    if (!meData || !findMyClinicsData?.findMyClinics.clinics) {
      return;
    }

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

  return { loading };
}

export default useLoginInitialization;
