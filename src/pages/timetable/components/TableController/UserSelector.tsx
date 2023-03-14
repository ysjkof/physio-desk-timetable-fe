import { useState } from 'react';
import { CheckableButton } from '../../../../components';
import { ChevronLeft, ChevronRight } from '../../../../svgs';
import { cls } from '../../../../utils/commonUtils';
import { toggleHiddenUsers, useStore } from '../../../../store';
import { Member } from '../../../../models';
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
          {members.map((_member, i) => {
            const member = new Member(_member);
            const nameAndState = member.getFormattedNameWithStateIfWithdrawn();

            return (
              <CheckableButton
                key={i}
                color={_member.color?.value}
                checked={isShowUser(_member.id)}
                label={nameAndState}
                onClick={() => toggleUsers(_member.id)}
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
