import { type ReactNode, useRef } from 'react';
import { cls, getMemberState } from '../../../../utils/commonUtils';
import { DEFAULT_COLOR } from '../../../../constants/constants';
import { Mail } from '../../../../svgs';
import type { MemberOfGetMember } from '../../../../types/processedGeneratedTypes';

const MemberCard = ({ member }: { member: MemberOfGetMember }) => {
  const {
    accepted,
    manager,
    staying,
    user: { name, email },
    color,
  } = member;

  const memberState = getMemberState({ accepted, manager, staying });

  return (
    <div className="flex h-56 gap-6 border bg-white p-4">
      <div className="flex w-full flex-col justify-between gap-2 text-[#64648E]">
        <h1
          className="text-2xl font-bold text-[#262850]"
          style={{ color: color?.value || DEFAULT_COLOR }}
        >
          {name}
        </h1>
        <div className="flex gap-2">
          <span
            className={cls(
              memberState === '수락대기'
                ? 'badge-green'
                : memberState === '탈퇴'
                ? 'badge-red'
                : 'badge-blue'
            )}
          >
            {memberState}
          </span>
        </div>
        <div className="grow overflow-y-scroll" />
        <div className="flex flex-col gap-1 border-t">
          <TextWithIcon textContent={email} icon={<Mail />} />
        </div>
      </div>
    </div>
  );
};

interface TextWithIconProps {
  textContent: string;
  icon: ReactNode;
}

const TextWithIcon = ({ textContent, icon }: TextWithIconProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const copyText = () => {
    navigator.clipboard.writeText(textContent);
  };

  return (
    <div
      ref={ref}
      className="tooltip mt-2 flex cursor-pointer items-center gap-x-1 px-3"
      onClick={copyText}
    >
      {icon}
      {textContent}
      <div className="tooltip-text">눌러서 복사하기</div>
    </div>
  );
};

export default MemberCard;
