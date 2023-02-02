import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { ClinicsOfClient } from '../../../../models';
import { GET_MEMBER_DOCUMENT } from '../../../../graphql';
import MemberCard from './MemberCard';
import CardSection from './CardSection';
import VacationTable from './VacationTable';
import CalendarAndEventList from './CalendarAndEventList';
import { Warning } from '../../../../components';
import type {
  GetMemberQuery,
  GetMemberQueryVariables,
} from '../../../../types/generated.types';

const MemberDetail = () => {
  const { memberId } = useParams();
  const clinicId = ClinicsOfClient.getSelectedClinic().id;

  const { data } = useQuery<GetMemberQuery, GetMemberQueryVariables>(
    GET_MEMBER_DOCUMENT,
    {
      variables: { input: { clinicId, id: Number(memberId) } },
    }
  );

  if (!data || !data.getMember.member)
    return <Warning>데이터가 없습니다. 잘못된 접근입니다.</Warning>;

  return (
    <div className="flex h-full w-full overflow-x-scroll bg-[#F9F9FF]">
      <div className="mx-10 flex min-w-[750px] basis-full flex-col gap-y-6 py-10">
        <MemberCard member={data.getMember.member} />
        <CardSection countOfPatient={data.getMember.countOfPatient} />
        <VacationTable />
      </div>
      <CalendarAndEventList />
    </div>
  );
};

export default MemberDetail;
