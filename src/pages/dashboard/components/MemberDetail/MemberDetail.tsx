import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { lazy, useEffect, useState } from 'react';
import { GET_MEMBER_DOCUMENT } from '../../../../graphql';
import MemberCard from './MemberCard';
import CardSection from './CardSection';
import { useStore } from '../../../../store';
import type {
  GetMemberQuery,
  GetMemberQueryVariables,
} from '../../../../types/generated.types';
import type { MemberOfGetMember } from '../../../../types/common.types';

const Warning = lazy(() => import('../../../../components/Warning'));

const MemberDetail = () => {
  const [member, setMember] = useState<MemberOfGetMember>();
  const clinicId = useStore((state) => state.pickedClinicId);
  const { memberId } = useParams();

  const variables = { input: { clinicId, id: Number(memberId) } };

  const { data } = useQuery<GetMemberQuery, GetMemberQueryVariables>(
    GET_MEMBER_DOCUMENT,
    { variables }
  );

  useEffect(() => {
    if (!data?.getMember.member) return;
    setMember(data.getMember.member);
  }, [data]);

  if (!member) return <Warning>데이터가 없습니다. 잘못된 접근입니다.</Warning>;

  return (
    <div className="flex h-full w-full basis-full flex-col gap-y-6 overflow-x-scroll bg-[#F9F9FF] p-10">
      <MemberCard member={member} />
      <CardSection countOfPatient={data?.getMember.countOfPatient || 0} />
    </div>
  );
};

export default MemberDetail;
