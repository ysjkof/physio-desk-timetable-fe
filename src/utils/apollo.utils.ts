import { gql } from '@apollo/client';
import { FIND_MY_CLINICS_DOCUMENT, ME_DOCUMENT } from '../graphql';
import type { FindMyClinicsQuery, MeQuery } from '../types/generated.types';
import type { MyClinic } from '../types/common.types';
import { type ClientOfStore, setToast } from '../store';

/** ok, error만 있는 GraphQL 응답을 받고 토스트 출력이나 콜백 실행 */
export function simpleCheckGQLError(
  ok: boolean,
  error?: string | null,
  callback?: () => void
) {
  if (error) {
    setToast({ messages: [`오류가 발생했습니다; ${error}`] });
  }
  if (callback && ok) callback();
}

export const cacheUpdateUserName = (
  client: ClientOfStore,
  id: number,
  name: string
) => {
  client?.writeFragment({
    id: `User:${id}`,
    fragment: gql`
      fragment NameFields on User {
        name
      }
    `,
    data: { name },
  });
};

interface CacheUpdatePersonalClinicNameProps {
  client: ClientOfStore;
  clinicId: number;
  clinicName: string;
  userName: string;
}

export const cacheUpdatePersonalClinicName = ({
  client,
  clinicId,
  clinicName,
  userName,
}: CacheUpdatePersonalClinicNameProps) => {
  client?.writeFragment({
    id: `Clinic:${clinicId}`,
    fragment: gql`
      fragment ClinicName on Clinic {
        name
      }
    `,
    data: { name: `${userName}:${clinicName.split(':').at(-1)}` },
  });
};

export const cacheUpdateMemberAccepted = (
  client: ClientOfStore,
  id: number
) => {
  client?.writeFragment({
    id: `Member:${id}`,
    fragment: gql`
      fragment AcceptedFields on Member {
        staying
        accepted
      }
    `,
    data: { staying: true, accepted: true },
  });
};

export const cacheAddClinicToMyClinics = (
  client: ClientOfStore,
  clinic: MyClinic
) => {
  const variables = { input: { includeInactivate: true } };
  client?.cache.updateQuery<FindMyClinicsQuery>(
    { query: FIND_MY_CLINICS_DOCUMENT, variables },
    (cacheData) => {
      if (!cacheData?.findMyClinics.clinics)
        throw new Error(
          'useCreateClinic에서 캐시 업데이트 중에 clinic이 없습니다.'
        );

      const newData = structuredClone(cacheData);
      newData?.findMyClinics.clinics?.push(clinic);
      return newData;
    }
  );
};

export const cacheUpdateMemberOfMe = (
  client: ClientOfStore,
  clinic: MyClinic
) => {
  client?.cache.updateQuery<MeQuery>({ query: ME_DOCUMENT }, (cacheData) => {
    if (!cacheData?.me.members) {
      throw new Error(
        'useCreateClinic에서 캐시 업데이트 중에 members가 없습니다.'
      );
    }

    const newData = structuredClone(cacheData);
    const newMember = {
      ...clinic.members[0],
      clinic,
    };
    newData?.me.members?.push(newMember);
    return newData;
  });
};
