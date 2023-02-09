import { useState, type ReactNode } from 'react';
import { getStringOfDateTime } from '../../../../utils/date.utils';
import { useAcceptInvitation, useRefuseInvitation } from '../../../../hooks';
import { ConfirmModal } from '../../../../components';

interface WaitingCardProps {
  memberId: number;
  icon: ReactNode;
  name: string;
  createAt: string;
}

const WaitingCard = ({ memberId, icon, name, createAt }: WaitingCardProps) => {
  const { refuseInvitation } = useRefuseInvitation({ memberId });
  const [showReject, setShowReject] = useState(false);
  const closeReject = () => setShowReject(false);
  const openReject = () => setShowReject(true);

  const { acceptInvitation } = useAcceptInvitation({ memberId });
  const [showInvitation, setShowInvitation] = useState(false);
  const closeInvitation = () => setShowInvitation(false);
  const openInvitation = () => setShowInvitation(true);

  return (
    <div className="flex h-full w-80 items-center gap-4 rounded-md border bg-white p-4">
      <div className="h-full w-24">{icon}</div>
      <div className="w-full">
        <div className="flex flex-col">
          <span className="text-base text-[#262850]">{name}</span>
          <span className="text-sm text-[#8D8DAD]">
            {getStringOfDateTime(new Date(createAt))}
          </span>
        </div>
        <div className="mt-4 flex justify-end gap-2 text-sm">
          <button
            className="css_default-button w-1/2 bg-[#E4E4ED] text-[#262850]"
            type="button"
            onClick={openReject}
          >
            거절
          </button>
          <button
            className="css_default-button w-1/2 bg-[#6BA6FF] text-white"
            type="button"
            onClick={openInvitation}
          >
            수락
          </button>
        </div>
      </div>
      {showReject && (
        <ConfirmModal
          closeAction={closeReject}
          confirmAction={refuseInvitation}
          messages={['초대를 거절합니다.']}
          targetName={name}
          buttonText="거절하기"
        />
      )}
      {showInvitation && (
        <ConfirmModal
          closeAction={closeInvitation}
          confirmAction={acceptInvitation}
          messages={['초대를 수락합니다.']}
          targetName={name}
          buttonText="수락하기"
        />
      )}
    </div>
  );
};

export default WaitingCard;
