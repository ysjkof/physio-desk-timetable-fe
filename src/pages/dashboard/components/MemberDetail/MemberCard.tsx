import { PropsWithChildren } from 'react';
import { Mail, Phone } from '../../../../svgs';
import { getMemberState } from '../../../../utils/common.utils';
import type { MemberOfGetMember } from '../../../../types/common.types';

const MemberCard = ({ member }: { member: MemberOfGetMember }) => {
  const {
    accepted,
    manager,
    staying,
    user: { name, email, role },
  } = member;

  const memberState = getMemberState({ accepted, manager, staying });

  return (
    <div className="flex h-96 gap-6 border bg-white p-4">
      <div className="bg-[TODO:프로필사진설정] h-80 w-60 rounded-md bg-gray-100" />
      <div className="flex w-full flex-col justify-between gap-2 text-[#64648E]">
        <h1 className="text-2xl font-bold text-[#262850]">{name}</h1>
        <div className="flex gap-2">
          <span className="badge-blue">{memberState}</span>
          <span className="badge-blue">
            {/* DB 수정 필요 */}
            {role}
          </span>
        </div>
        <div className="grow overflow-y-scroll " />
        <div className="flex flex-wrap items-center gap-1 ">
          <PhoneBadge>010-0000-0000</PhoneBadge>
          <MailBadge>{email}</MailBadge>
        </div>
      </div>
    </div>
  );
};

const PhoneBadge = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-w-32 flex items-center gap-1 rounded-full border py-2 px-3">
      <Phone />
      <span>{children}</span>
    </div>
  );
};

const MailBadge = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex items-center gap-1 rounded-full border py-2 px-3 ">
      <Mail />
      <span className="max-w-[470px] overflow-hidden text-ellipsis">
        {children}
      </span>
    </div>
  );
};

export default MemberCard;
