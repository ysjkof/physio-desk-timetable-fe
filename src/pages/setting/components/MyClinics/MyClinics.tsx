import { type PropsWithChildren } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  BuildingLarge,
  BuildingLargeWithBan,
  BuildingLargeWithX,
  HourglassWithArrow,
} from '../../../../svgs';
import { getMemberState, renameUseSplit } from '../../../../utils/common.utils';
import WaitingCard from './WaitingCard';
import ClinicCard from './ClinicCard';
import DisabledCard from './DisabledCard';
import type {
  MyMembers,
  SettingOutletContext,
} from '../../../../types/common.types';
import { useFindMyMembers } from '../../../../hooks';

const MyClinics = () => {
  const { outletWidth } = useOutletContext<SettingOutletContext>();

  const [myMembers] = useFindMyMembers();

  const members: MyMembers = {
    관리자: [],
    직원: [],
    탈퇴: [],
    승인대기: [],
    폐쇄: [],
  };

  myMembers?.forEach((member) => {
    if (!member.clinic.isActivated) {
      members.폐쇄.push(member);
      return;
    }
    const memberState = getMemberState({
      staying: member.staying,
      accepted: member.accepted,
      manager: member.manager,
    });
    members[memberState].push(member);
  });

  return (
    <div
      style={{ width: outletWidth }}
      className="overflow-y-scroll px-14 py-10"
    >
      <Title />
      <div className="mt-10 flex flex-col gap-10">
        <ClinicsContainer title="승인대기 병원">
          {members.승인대기.map((member) => (
            <WaitingCard
              key={member.id}
              memberId={member.id}
              icon={<HourglassWithArrow className="h-full w-full" />}
              name={member.clinic.name}
              createAt={member.createdAt}
            />
          ))}
        </ClinicsContainer>
        <ClinicsContainer title="가입한 병원">
          {members.직원.map((member) => (
            <ClinicCard
              key={member.id}
              memberId={member.id}
              clinicId={member.clinic.id}
              icon={<BuildingLarge className="h-full w-full" />}
              name={member.clinic.name}
              memberRole="직원"
              createAt={member.createdAt}
            />
          ))}
          {members.관리자.map((member) => (
            <ClinicCard
              key={member.id}
              memberId={member.id}
              clinicId={member.clinic.id}
              icon={<BuildingLarge className="h-full w-full" />}
              name={renameUseSplit(member.clinic.name)}
              memberRole="관리자"
              createAt={member.createdAt}
            />
          ))}
        </ClinicsContainer>
        <ClinicsContainer title="탈퇴한 병원">
          {members.탈퇴.map((member) => (
            <DisabledCard
              key={member.id}
              icon={
                <BuildingLargeWithX className="h-full w-full stroke-[#5C5E80]" />
              }
              name={member.clinic.name}
              memberRole={member.manager ? '관리자' : '직원'}
              createAt={member.createdAt}
            />
          ))}
        </ClinicsContainer>
        <ClinicsContainer title="폐쇄한 병원">
          {members.폐쇄.map((member) => (
            <DisabledCard
              key={member.id}
              icon={
                <BuildingLargeWithBan className="h-full w-full stroke-[#5C5E80]" />
              }
              name={member.clinic.name}
              memberRole={member.manager ? '관리자' : '직원'}
              createAt={member.createdAt}
            />
          ))}
        </ClinicsContainer>
      </div>
    </div>
  );
};

const Title = () => {
  return (
    <div className="flex flex-col items-baseline">
      <h1 className="text-2xl font-semibold text-[#262850]">병원 목록</h1>
      <span className="text-[#8D8DAD]">
        가입했던 모든 병원 목록을 볼 수 있습니다.
      </span>
    </div>
  );
};

interface ClinicsContainerProps extends PropsWithChildren {
  title: string;
}

const ClinicsContainer = ({ title, children }: ClinicsContainerProps) => {
  return (
    <div className="flex flex-col gap-4">
      <h2>{title}</h2>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
};

export default MyClinics;
