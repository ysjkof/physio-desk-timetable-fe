import { useState } from 'react';
import { CheckableButton } from '../../../../components';
import { ChevronLeft, ChevronRight } from '../../../../svgs';
import { cls, getMemberState } from '../../../../utils/commonUtils';
import { toggleHiddenUsers, useStore } from '../../../../store';
import type { UserSelectorProps } from '../../../../types/propsTypes';

const UserSelector = ({ members }: UserSelectorProps) => {
  const [isSpreading, setIsSpreading] = useState(false);

  const hiddenUsers = useStore((state) => state.hiddenUsers);

  const isShowUser = (memberId: number) => {
    return !hiddenUsers.has(memberId);
  };

  const toggleUsers = (memberId: number) => {
    toggleHiddenUsers(memberId, members.length);
  };

  return (
    <div className="flex grow items-center gap-2">
      <SpreadingToggleButton
        isSpreading={isSpreading}
        setIsSpreading={setIsSpreading}
      />
      {isSpreading && (
        <div className="flex flex-wrap items-center gap-2">
          {members.map((member, i) => {
            const { accepted, manager, staying } = member;
            const state = getMemberState({ accepted, manager, staying });

            let memberName = member.user.name;
            if (state === '탈퇴') {
              memberName = `${memberName} (탈퇴)`;
            }

            return (
              <CheckableButton
                key={i}
                color={member.color?.value}
                checked={isShowUser(member.id)}
                label={memberName}
                onClick={() => toggleUsers(member.id)}
                hasBorder
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

interface SpreadingToggleButtonProps {
  isSpreading: boolean;
  setIsSpreading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SpreadingToggleButton = ({
  isSpreading,
  setIsSpreading,
}: SpreadingToggleButtonProps) => {
  const toggleSpreading = () => setIsSpreading((prev) => !prev);

  return (
    <button
      className={cls(
        'flex transform items-center justify-center gap-2 whitespace-nowrap rounded-full border py-1 px-4 text-base font-medium',
        isSpreading ? 'border-transparent text-cst-blue ring-2' : ''
      )}
      onClick={toggleSpreading}
      type="button"
    >
      <span>치료사 선택하기</span>
      {isSpreading ? <ChevronLeft className="stroke-2" /> : <ChevronRight />}
    </button>
  );
};

export default UserSelector;
