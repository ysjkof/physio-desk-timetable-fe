import { gql } from '@apollo/client';
import { client } from '../apollo';
import { GET_MY_MEMBERS_DOCUMENT, ME_DOCUMENT } from '../graphql';
import type { GetMyMembersQuery, MeQuery } from '../types/generatedTypes';
import type {
  MyClinic,
  UpdatePrescriptionVariables,
} from '../types/processedGeneratedTypes';
import { MyMembersType } from '../types/processedGeneratedTypes';

export const cacheUpdateUserName = (id: number, name: string) => {
  client.writeFragment({
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
  clinicId: number;
  clinicName: string;
  userName: string;
}

export const cacheUpdatePersonalClinicName = ({
  clinicId,
  clinicName,
  userName,
}: CacheUpdatePersonalClinicNameProps) => {
  client.writeFragment({
    id: `Clinic:${clinicId}`,
    fragment: gql`
      fragment ClinicName on Clinic {
        name
      }
    `,
    data: { name: `${userName}:${clinicName.split(':').at(-1)}` },
  });
};

export const cacheUpdateMemberState = (
  id: number,
  fields: { staying?: boolean; accepted?: boolean }
) => {
  client.writeFragment({
    id: `Member:${id}`,
    fragment: gql`
      fragment AcceptedFields on Member {
        staying
        accepted
      }
    `,
    data: fields,
  });
};

export const cacheUpdateMemberColor = (id: number, color: string) => {
  client.writeFragment({
    id: `Member:${id}`,
    fragment: gql`
      fragment ColorField on Member {
        color
      }
    `,
    data: { color },
  });
};

export const cacheUpdatePrescription = (
  id: number,
  variable: UpdatePrescriptionVariables
) => {
  client.writeFragment({
    id: `Prescription:${id}`,
    fragment: gql`
      fragment UpdatePrescriptionField on Prescription {
        name
        description
        activate
      }
    `,
    data: { ...variable },
  });
};

export const cacheAddClinicToMyMembers = (clinic: MyClinic) => {
  client.cache.updateQuery<GetMyMembersQuery>(
    { query: GET_MY_MEMBERS_DOCUMENT },
    (cacheData) => {
      if (!cacheData?.getMyMembers.members)
        throw new Error('Calling cacheAddClinicToMyMembers()', {
          cause: 'cacheData가 false입니다.',
        });

      const newData = structuredClone(cacheData);

      const member = clinic.members[0];
      const newMember: FlatArray<MyMembersType, 1> = {
        clinic,
        ...member,
      };
      newData?.getMyMembers.members?.push(newMember);
      return newData;
    }
  );
};

export const cacheUpdateDeleteMemberOfGetMyMembers = (memberId: number) => {
  client.cache.updateQuery<GetMyMembersQuery>(
    { query: GET_MY_MEMBERS_DOCUMENT },
    (cacheData) => {
      if (!cacheData?.getMyMembers.members) {
        throw new Error('Calling cacheUpdateMemberOfGetMyMembers', {
          cause: 'cacheData가 false입니다.',
        });
      }

      const newData = structuredClone(cacheData);
      const newMember = newData.getMyMembers.members.filter(
        (member) => member.id !== memberId
      );
      newData.getMyMembers.members = newMember;
      return newData;
    }
  );
};

export const cacheUpdateMemberOfMe = (clinic: MyClinic) => {
  client.cache.updateQuery<MeQuery>({ query: ME_DOCUMENT }, (cacheData) => {
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
