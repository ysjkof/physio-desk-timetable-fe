import { useState } from 'react';
import { USER_COLORS } from '../../../../constants/constants';
import { CheckableButton } from '../../../../components';
import { ChevronLeft, ChevronRight } from '../../../../svgs';
import { cls } from '../../../../utils/common.utils';
import { useGetClinic, useMe } from '../../../../hooks';
import { updateLocalStorageHiddenUsers } from '../../../../utils/localStorage.utils';
import { toggleHiddenUsers, useStore } from '../../../../store';
import type { HiddenUsersArr } from '../../../../types/store.types';

const UserSelector = () => {
  const [isSpreading, setIsSpreading] = useState(false);
  const [clinic, { variables }] = useGetClinic();
  const [, { getIdName }] = useMe();

  const hiddenUsers = useStore((state) => state.hiddenUsers);

  const isShowUser = (memberId: number) => {
    return !hiddenUsers.has(memberId);
  };

  const toggleUsers = (memberId: number) => {
    const callback = (hiddenUsers: HiddenUsersArr) => {
      if (!variables?.input.clinicId)
        throw new Error('UserSelector에서 clinic 변수 id를 못 받았습니다');

      updateLocalStorageHiddenUsers({
        ...getIdName(),
        clinicId: variables.input.clinicId,
        hiddenUsers,
      });
    };

    toggleHiddenUsers(memberId, callback);
  };

  return (
    <div className="flex basis-full items-center gap-2">
      <SpreadingToggleButton
        isSpreading={isSpreading}
        setIsSpreading={setIsSpreading}
      />
      {isSpreading && (
        <div className="flex flex-wrap items-center gap-2">
          {clinic?.members.map((member, i) => (
            <CheckableButton
              key={i}
              personalColor={USER_COLORS[i].deep}
              canSee={isShowUser(member.id)}
              label={member.user.name}
              onClick={() => toggleUsers(member.id)}
            />
          ))}
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
