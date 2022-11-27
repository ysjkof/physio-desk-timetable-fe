import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { IsLoggedIn } from '../_legacy_components/templates/GlobalLayout';
import { loggedInUserVar, tableTimeVar, tableDisplayVar } from '../store';
import localStorageUtils from '../utils/localStorageUtils';
import useStore, { makeSelectedClinic } from './useStore';
import { ME_DOCUMENT, FIND_MY_CLINICS_DOCUMENT } from '../graphql';
import { TableTime, TableDisplay, ClinicsOfClient } from '../models';
import {
  ClinicType,
  FindMyClinicsQuery,
  MeQuery,
} from '../types/generated.types';
import type {
  MyClinic,
  IClinicList,
  ISelectedClinic,
  UserIdAndName,
  ClinicOfClient,
} from '../types/common.types';
import { SelectedClinic } from '../models/SelectedClinic';

function useLoginInitialization({ isLoggedIn }: IsLoggedIn) {
  const [loading, setLoading] = useState(true);

  const { setSelectedInfo, clinicListsVar } = useStore();

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
    const myClinics = ClinicsOfClient.createClinicsOfClient(clinics);
    if (localClinics === null) {
      ClinicsOfClient.saveToLocalStorage(myClinics);
      return;
    }
    const updatedMyClinics = myClinics.map((clinic) => {
      const myClinic = myClinics.find((myClinic) => myClinic.id === clinic.id);
      return myClinic
        ? ClinicsOfClient.combineClinic(clinic, myClinic)
        : clinic;
    });
    ClinicsOfClient.setValue(updatedMyClinics);
    clinicListsVar(updatedMyClinics);
  };

  // 삭제할거임
  const setClinicLists = (clinics: MyClinic[]) => {
    const myClinics = ClinicsOfClient.createClinicsOfClient(clinics);

    let updatedMyClinics: ClinicOfClient[] = myClinics;

    const localClinics = ClinicsOfClient.getFromLocalStorage();

    if (localClinics) {
      updatedMyClinics = myClinics.map((clinic) => {
        const myClinic = myClinics.find(
          (myClinic) => myClinic.id === clinic.id
        );
        return myClinic
          ? ClinicsOfClient.combineClinic(clinic, myClinic)
          : clinic;
      });
    }

    ClinicsOfClient.saveToLocalStorage(updatedMyClinics);

    clinicListsVar(updatedMyClinics);

    return updatedMyClinics;
  };

  const setSelectedClinic = (updatedMyClinics: IClinicList[]) => {
    if (!meData) return console.error('loggedInUser가 없습니다');

    const localSelectClinic = localStorageUtils.get<ISelectedClinic>({
      key: 'selectedClinic',
      userId: meData.me.id,
      userName: meData.me.name,
    });

    const existInClinicList = () => {
      return updatedMyClinics.find(
        (clinic) => clinic.id === localSelectClinic?.id
      );
    };
    let newSelectedClinic =
      existInClinicList() ||
      updatedMyClinics.find((clinic) => clinic.type === ClinicType.Personal);

    if (!newSelectedClinic) throw new Error('선택된 병원이 없습니다');

    setSelectedInfo(
      'clinic',
      makeSelectedClinic(newSelectedClinic, meData.me.id),
      () =>
        localStorageUtils.set({
          key: 'selectedClinic',
          userId: meData.me.id,
          userName: meData.me.name,
          value: newSelectedClinic,
        })
    );
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
    localStorageUtils.remove({ ...userIdAndName, key: 'selectedClinic' });

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
    // 현재 미작동
    setSelectedClinic(setClinicLists(findMyClinicsData.findMyClinics.clinics));

    ClinicsOfClient.initialize(userIdAndName);
    initClinicsOfClient(findMyClinicsData.findMyClinics.clinics);

    loggedInUserVar(meData.me);

    setLoading(false);
  }, [meData, findMyClinicsData]);

  return { loading };
}

export default useLoginInitialization;
