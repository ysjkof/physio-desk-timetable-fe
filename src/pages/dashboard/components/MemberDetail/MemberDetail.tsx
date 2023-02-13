import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { lazy } from 'react';
import { GET_MEMBER_DOCUMENT } from '../../../../graphql';
import MemberCard from './MemberCard';
import CardSection from './CardSection';
import type {
  GetMemberQuery,
  GetMemberQueryVariables,
} from '../../../../types/generated.types';
import { useStore } from '../../../../store';

const Warning = lazy(() => import('../../../../components/Warning'));
const Loading = lazy(() => import('../../../../components/Loading'));

const MemberDetail = () => {
  const clinicId = useStore((state) => state.pickedClinicId);
  const { memberId } = useParams();

  const variables = { input: { clinicId, id: Number(memberId) } };

  const { data, loading } = useQuery<GetMemberQuery, GetMemberQueryVariables>(
    GET_MEMBER_DOCUMENT,
    { variables }
  );

  if (loading) return <Loading />;
  if (!data || !data.getMember.member)
    return <Warning>데이터가 없습니다. 잘못된 접근입니다.</Warning>;

  return (
    <div className="flex h-full w-full basis-full flex-col gap-y-6 overflow-x-scroll bg-[#F9F9FF] p-10">
      <MemberCard member={data?.getMember.member || []} />
      <CardSection countOfPatient={data?.getMember.countOfPatient || 0} />
    </div>
  );
};

export default MemberDetail;
