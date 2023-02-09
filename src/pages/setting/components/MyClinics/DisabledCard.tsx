import { type ReactNode } from 'react';
import { getStringOfDateTime } from '../../../../utils/date.utils';

interface DisabledCardProps {
  icon: ReactNode;
  name: string;
  memberRole: string;
  createAt: string;
}

const DisabledCard = ({
  icon,
  name,
  memberRole,
  createAt,
}: DisabledCardProps) => {
  return (
    <div className="flex h-full w-80 items-center gap-4 rounded-md border border-[#C2C2D7] bg-[#DEDEEB] p-4">
      <div className="h-full w-24">{icon}</div>
      <div className="w-full">
        <div className="flex flex-col">
          <span className="text-base text-[#262850]">{name}</span>
          <span className="text-sm text-[#8D8DAD]">
            {getStringOfDateTime(new Date(createAt))}
          </span>
          <span className="text-xs text-[#8D8DAD]">{memberRole}</span>
        </div>
      </div>
    </div>
  );
};

export default DisabledCard;
