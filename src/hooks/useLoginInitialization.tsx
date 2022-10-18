import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { IsLoggedIn } from '../components/templates/GlobalLayout';
import { FindMyClinics, Me } from '../graphql/documentNode';
import { loggedInUserVar, viewOptionsVar } from '../store';
import {
  IClinic,
  IClinicList,
  ISelectedClinic,
  IViewOption,
  LoggedInUser,
} from '../types/type';
import localStorageUtils from '../utils/localStorageUtils';
import useStore, { makeSelectedClinic } from './useStore';
import {
  ClinicType,
  FindMyClinicsQuery,
  MeQuery,
} from '../models/generated.models';

function useLoginInitialization({ isLoggedIn }: IsLoggedIn) {
  const [loading, setLoading] = useState(true);
  const { setSelectedInfo, viewOptions, clinicListsVar } = useStore();
  const [meQuery, { data: meData }] = useLazyQuery<MeQuery>(Me);
  const [findMyClinicsQuery, { data: findMyClinicsData }] =
    useLazyQuery<FindMyClinicsQuery>(FindMyClinics, {
      variables: { input: { includeInactivate: true } },
    });

  const setViewOption = (meData: NonNullable<LoggedInUser>) => {
    const localViewOptions = localStorageUtils.get<IViewOption>({
      key: 'viewOption',
      userId: meData.id,
      userName: meData.name,
    });

    if (localViewOptions === null) {
      localStorageUtils.set({
        key: 'viewOption',
        userId: meData.id,
        userName: meData.name,
        value: viewOptions.get,
      });
    } else {
      viewOptionsVar(localViewOptions);
    }
  };

  const setClinicLists = (meData: MeQuery, clinics: IClinic[]) => {
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
      userId: meData.me.id,
      userName: meData.me.name,
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
      userId: meData.me.id,
      userName: meData.me.name,
      value: updatedMyClinics,
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

  const checkLatestStorage = (loginUser: MeQuery['me']) => {
    const localCreatedAt = localStorageUtils.get<string>({
      key: 'createdAt',
    });

    const createdAt = localCreatedAt ? new Date(localCreatedAt) : null;

    const latestDateString = '2022-09-08T09:25:00.000Z';
    const latestCreatedAt = new Date(latestDateString);

    if (createdAt && createdAt.getTime() >= latestCreatedAt.getTime()) return;

    const user = { userId: loginUser.id, userName: loginUser.name };
    localStorageUtils.remove({ ...user, key: 'clinicLists' });
    localStorageUtils.remove({ ...user, key: 'viewOption' });
    localStorageUtils.remove({ ...user, key: 'selectedClinic' });

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

    if (
      !meData ||
      !findMyClinicsData ||
      !findMyClinicsData.findMyClinics.clinics
    )
      return;
    checkLatestStorage(meData.me);
    setViewOption(meData.me);

    loggedInUserVar(meData.me);
    setSelectedClinic(
      setClinicLists(meData, findMyClinicsData.findMyClinics.clinics)
    );
    setLoading(false);
  }, [meData, findMyClinicsData]);

  return { loading };
}

export default useLoginInitialization;
