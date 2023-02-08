import { useState, type ReactNode } from 'react';
import { getStringOfDateTime } from '../../../../utils/date.utils';
import { ConfirmModal } from '../../../../components';
import { useDeactivateClinic, useLeaveClinic } from '../../../../hooks';

interface ClinicCardProps {
  memberId: number;
  clinicId: number;
  icon: ReactNode;
  name: string;
  memberRole: string;
  createAt: string;
}

const ClinicCard = ({
  memberId,
  clinicId,
  icon,
  name,
  memberRole,
  createAt,
}: ClinicCardProps) => {
  const { leaveClinic } = useLeaveClinic({ memberId });
  const [showRetirement, setShowRetirement] = useState(false);
  const closeRetirement = () => setShowRetirement(false);
  const openRetirement = () => setShowRetirement(true);

  const { deactivateClinic } = useDeactivateClinic({ clinicId });
  const [showDeactivate, setShowDeactivate] = useState(false);
  const closeDeactivate = () => setShowDeactivate(false);
  const openDeactivate = () => setShowDeactivate(true);

  return (
    <div className="flex h-full w-80 items-center gap-4 rounded-md border bg-white p-4">
      <div className="h-full w-24">{icon}</div>
      <div className="w-full">
        <div className="flex flex-col">
          <span className="text-base text-[#262850]">{name}</span>
          <span className="text-sm text-[#8D8DAD]">
            {getStringOfDateTime(new Date(createAt))}
          </span>
          <span className="text-xs text-[#8D8DAD]">{memberRole}</span>
        </div>
        <div className="mt-4 flex justify-end gap-2 text-sm">
          <button
            className="css_default-button w-1/2 bg-[#E4E4ED] text-[#262850]"
            type="button"
            onClick={openRetirement}
          >
            탈퇴하기
          </button>
          {memberRole === '관리자' && (
            <button
              className="css_default-button w-1/2 bg-[#F0817A] text-white"
              type="button"
              onClick={openDeactivate}
            >
              폐쇄하기
            </button>
          )}
        </div>
      </div>
      {showRetirement && (
        <ConfirmModal
          closeAction={closeRetirement}
          confirmAction={leaveClinic}
          messages={['병원을 탈퇴합니다.']}
          targetName={name}
          buttonText="탈퇴하기"
        />
      )}
      {showDeactivate && (
        <ConfirmModal
          closeAction={closeDeactivate}
          confirmAction={deactivateClinic}
          messages={['병원을 폐쇄합니다.']}
          targetName={name}
          buttonText="폐쇄하기"
        />
      )}
    </div>
  );
};

export default ClinicCard;
