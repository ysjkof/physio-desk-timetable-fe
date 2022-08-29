import { useEffect, useState } from 'react';
import {
  ClinicType,
  MeQuery,
  useFindMyClinicsQuery,
} from '../graphql/generated/graphql';
import { loggedInUserVar, viewOptionsVar } from '../store';
import {
  IClinic,
  IClinicList,
  ISelectedClinic,
  IViewOption,
  LoggedInUser,
} from '../types/type';
import { getLocalStorageItem, setLocalStorage } from '../utils/utils';
import { useMe } from './useMe';
import useStore, { makeSelectedClinic } from './useStore';

function useLoginInitialization() {
  const [loading, setLoading] = useState(true);
  const { data: meData } = useMe();
  const { setSelectedInfo, viewOptions, clinicListsVar } = useStore();
  const { data: findMyClinicsData } = useFindMyClinicsQuery({
    variables: { input: { includeInactivate: true } },
  });

  const setViewOption = (meData: NonNullable<LoggedInUser>) => {
    const localViewOptions = getLocalStorageItem<IViewOption>({
      key: 'VIEW_OPTION',
      userId: meData.id,
      userName: meData.name,
    });

    if (localViewOptions === null) {
      setLocalStorage({
        key: 'VIEW_OPTION',
        userId: meData.id,
        userName: meData.name,
        value: viewOptions,
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

    const localClinics = getLocalStorageItem<IClinicList[]>({
      key: 'CLINIC_LISTS',
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

    setLocalStorage({
      key: 'CLINIC_LISTS',
      userId: meData.me.id,
      userName: meData.me.name,
      value: updatedMyClinics,
    });
    clinicListsVar(updatedMyClinics);

    return updatedMyClinics;
  };

  const setSelectedClinic = (updatedMyClinics: IClinicList[]) => {
    if (!meData) return console.error('loggedInUser가 없습니다');

    const localSelectClinic = getLocalStorageItem<ISelectedClinic>({
      key: 'SELECTED_CLINIC',
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
      makeSelectedClinic(newSelectedClinic, meData.me.id)
    );
  };

  useEffect(() => {
    setLoading(true);
    if (!meData) return console.log('meData가 없습니다');
    if (!findMyClinicsData || !findMyClinicsData.findMyClinics.clinics)
      return console.log('findMyClinicsData가 없습니다');

    loggedInUserVar(meData.me);
    setSelectedClinic(
      setClinicLists(meData, findMyClinicsData.findMyClinics.clinics)
    );
    setLoading(false);
  }, [meData, findMyClinicsData]);

  useEffect(() => {
    if (!meData) return;
    setViewOption(meData.me);
  }, [meData?.me.id]);

  return { loading };
}

export default useLoginInitialization;
