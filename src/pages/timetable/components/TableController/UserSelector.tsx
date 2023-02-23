import { useState } from 'react';
import { USER_COLORS } from '../../../../constants/constants';
import { CheckableButton } from '../../../../components';
import { ChevronLeft, ChevronRight } from '../../../../svgs';
import { cls, getMemberState } from '../../../../utils/commonUtils';
import { useGetClinic } from '../../../../hooks';
import { toggleHiddenUsers, useStore } from '../../../../store';

const UserSelector = () => {
  const [isSpreading, setIsSpreading] = useState(false);
  const [clinic] = useGetClinic();

  const hiddenUsers = useStore((state) => state.hiddenUsers);

  const isShowUser = (memberId: number) => {
    return !hiddenUsers.has(memberId);
  };

  const toggleUsers = (memberId: number) => {
    toggleHiddenUsers(memberId);
  };

  return (
    <div className="flex grow items-center gap-2">
      <SpreadingToggleButton
        isSpreading={isSpreading}
        setIsSpreading={setIsSpreading}
      />
      {isSpreading && (
        <div className="flex flex-wrap items-center gap-2">
          {clinic?.members
            .filter(
              ({ accepted, staying, manager }) =>
                // filter없이 map에서 수락대기를 거르면 스케쥴과 index가 달라서 색깔이 틀린다
                // TODO: 색상 저장하는 방식 변경하면 이부분 없애기
                getMemberState({ accepted, staying, manager }) !== '수락대기'
            )
            .map((member, i) => {
              const { accepted, manager, staying } = member;
              const state = getMemberState({ accepted, manager, staying });

              let memberName = member.user.name;
              if (state === '탈퇴') {
                memberName = `${memberName} (탈퇴)`;
              }

              return (
                <CheckableButton
                  key={i}
                  personalColor={USER_COLORS[i].deep}
                  canSee={isShowUser(member.id)}
                  label={memberName}
                  onClick={() => toggleUsers(member.id)}
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
