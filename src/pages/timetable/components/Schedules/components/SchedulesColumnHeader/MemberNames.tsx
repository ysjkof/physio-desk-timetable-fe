import { useState } from 'react';
import { RgbStringColorPicker } from 'react-colorful';
import { cls } from '../../../../../../utils/commonUtils';
import { useStore } from '../../../../../../store';
import { EllipsisVertical } from '../../../../../../svgs';
import { MenuButton, Modal } from '../../../../../../components';
import { useMe } from '../../../../../../hooks';
import { DEFAULT_COLOR } from '../../../../../../constants/constants';
import { useUpdateMemberColor } from '../../../../../../hooks';
import { Member } from '../../../../../../models';
import type { MemberWithEvent } from '../../../../../../types/commonTypes';
import type { MemberNameProps } from '../../../../../../types/propsTypes';

const MemberNames = ({ members }: MemberNameProps) => {
  const hiddenUsers = useStore((state) => state.hiddenUsers);

  const [me] = useMe();

  return (
    <div className="schedules__member-name-title">
      {members.map((member) => {
        if (hiddenUsers.has(member.id)) return null;

        return (
          <MemberNameItem
            key={member.id}
            member={member}
            hasSetting={me?.id === member.user.id}
          />
        );
      })}
    </div>
  );
};

interface MemberNameItemProps {
  member: MemberWithEvent;
  hasSetting: boolean;
}
const MemberNameItem = (props: MemberNameItemProps) => {
  const { member: _member, hasSetting } = props;

  const member = new Member(_member);

  const [color, setColor] = useState(member.getColor());
  const selectColor = (newColor: string) => {
    setColor(newColor);
  };

  const [isOpen, setOpen] = useState(false);
  const openSetting = () => setOpen(true);
  const closeSetting = () => {
    setOpen(false);
    setColor(member.getColor());
  };

  const { updateMemberColor } = useUpdateMemberColor();

  const update = () => {
    if (!color || color === member.getColor()) return;
    updateMemberColor(_member.id, color);
  };

  return (
    <div
      className="schedules__member-name-item"
      style={{ borderBottomColor: color || DEFAULT_COLOR }}
    >
      <span className="h-4 overflow-hidden text-ellipsis whitespace-nowrap">
        {member.getState() === '탈퇴' && '탈퇴'}
      </span>

      <div className="flex justify-between">
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {member.getName()}
        </span>
        {hasSetting && (
          <button onClick={openSetting}>
            <EllipsisVertical />
          </button>
        )}
      </div>
      {isOpen && (
        <Modal closeAction={closeSetting} isTransparentBackground>
          <div className="flex flex-col items-center justify-center rounded-md border border-gray-400 bg-white shadow-cst">
            <div className="p-4">
              <RgbStringColorPicker color={color} onChange={selectColor} />
            </div>
            <div className="flex w-full gap-2 p-4">
              <MenuButton
                type="button"
                className="w-full bg-close-bg text-base font-medium text-font-gray"
                onClick={closeSetting}
              >
                취소
              </MenuButton>
              <MenuButton
                onClick={update}
                type="submit"
                className="w-full bg-cst-blue text-base font-medium text-white"
              >
                저장
              </MenuButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MemberNames;
