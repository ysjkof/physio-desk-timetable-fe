import { cls, isMemberActive } from '../../utils/commonUtils';
import { useClinicSelectorBtn } from './useClinicSelectorBtn';
import type { MyMembersType } from '../../types/processedGeneratedTypes';

const ClinicSelectorBtn = ({
  member,
}: {
  member: FlatArray<MyMembersType, 1>;
}) => {
  const { handleClick, isEnable, state, clinicStatus, clinicName, isActive } =
    useClinicSelectorBtn(member);

  const memberState = !isMemberActive(state) && state;

  return (
    <button
      onClick={handleClick}
      type="button"
      className={cls(
        'flex w-full gap-4 bg-inherit p-2 hover:bg-blue-200',
        isEnable ? 'font-semibold' : '',
        state === '수락대기' ? 'order-1' : '',
        clinicName.startsWith('전용: ') ? 'order-4' : '',
        isActive ? 'order-3' : 'order-6',
        state === '탈퇴' ? 'order-5' : ''
      )}
    >
      <span className="min-w-[3.5rem]">{clinicStatus || memberState}</span>
      <span className="text-left">{clinicName}</span>
    </button>
  );
};

export default ClinicSelectorBtn;
