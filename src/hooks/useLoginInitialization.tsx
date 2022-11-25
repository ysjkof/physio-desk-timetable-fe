import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { IsLoggedIn } from '../_legacy_components/templates/GlobalLayout';
import { loggedInUserVar, tableTimeVar, viewOptionsVar } from '../store';
import localStorageUtils from '../utils/localStorageUtils';
import useStore, { makeSelectedClinic } from './useStore';
import { ME_DOCUMENT, FIND_MY_CLINICS_DOCUMENT } from '../graphql';
import { TableTime } from '../models/TableTime';
import {
  ClinicType,
  FindMyClinicsQuery,
  MeQuery,
} from '../types/generated.types';
import type {
  IClinic,
  IClinicList,
  ISelectedClinic,
  IViewOption,
  UserIdAndName,
} from '../types/common.types';

function useLoginInitialization({ isLoggedIn }: IsLoggedIn) {
  const [loading, setLoading] = useState(true);

  const { setSelectedInfo, viewOptions, clinicListsVar } = useStore();

  const [meQuery, { data: meData }] = useLazyQuery<MeQuery>(ME_DOCUMENT);

  const [findMyClinicsQuery, { data: findMyClinicsData }] =
    useLazyQuery<FindMyClinicsQuery>(FIND_MY_CLINICS_DOCUMENT, {
      variables: { input: { includeInactivate: true } },
    });

  const setViewOption = (userIdAndName: UserIdAndName) => {
    const localViewOptions = localStorageUtils.get<IViewOption>({
      key: 'viewOption',
      ...userIdAndName,
    });

    if (localViewOptions === null) {
      localStorageUtils.set({
        key: 'viewOption',
        value: viewOptions.get,
        ...userIdAndName,
      });
    } else {
      viewOptionsVar(localViewOptions);
    }
  };

  const initializeTableTime = () => {
    const localTableTime = TableTime.getFromLocalStorage();
    if (localTableTime === null) {
      return TableTime.saveToLocalStorage(TableTime.time);
    }
    tableTimeVar(localTableTime);
  };

  const setClinicLists = (userIdAndName: UserIdAndName, clinics: IClinic[]) => {
    function injectKeyValue(clinics: IClinic[]): IClinicList[] {
      return clinics.map((clinic) => {
        const members = clinic.members.map((member) => ({
          ...member,
          isActivate: member.staying,
        }));
        return { ...clinic, members };
      });
    }

    const myClinics = injectKeyValue(clinics);
    let updatedMyClinics: IClinicList[] = myClinics;

    const localClinics = localStorageUtils.get<IClinicList[]>({
      key: 'clinicLists',
      ...userIdAndName,
    });

    if (localClinics) {
      updatedMyClinics = myClinics.map((clinic) => {
        const localClinic = localClinics.find(
          (localClinic) => localClinic.id === clinic.id
        );

        if (!localClinic) return clinic;

        return {
          ...localClinic,
          id: clinic.id,
          name: clinic.name,
          type: clinic.type,
          members: clinic.members.map((member) => {
            const sameMember = localClinic.members.find(
              (localMember) => localMember.id === member.id
            );
            return {
              ...member,
              ...(sameMember && { isActivate: sameMember.isActivate }),
            };
          }),
        };
      });
    }

    localStorageUtils.set({
      key: 'clinicLists',
      value: updatedMyClinics,
      ...userIdAndName,
    });
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
    setViewOption(userIdAndName);
    TableTime.initialize(userIdAndName);
    initializeTableTime();
    setSelectedClinic(
      setClinicLists(userIdAndName, findMyClinicsData.findMyClinics.clinics)
    );

    loggedInUserVar(meData.me);

    setLoading(false);
  }, [meData, findMyClinicsData]);

  return { loading };
}

export default useLoginInitialization;
