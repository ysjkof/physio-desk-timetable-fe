import { type ReactNode } from 'react';
import { PersonPlus } from '../../../../svgs';

const CardSection = ({ countOfPatient }: { countOfPatient: number }) => {
  return (
    <div className="flex justify-between gap-x-4 text-[#64648E]">
      <CardInDetail
        icon={<PersonPlus className="h-8 w-8" />}
        title="담당환자수"
        textContent={`${countOfPatient}명`}
      />
    </div>
  );
};

const CardInDetail = ({
  icon,
  title,
  textContent,
}: {
  icon: ReactNode;
  title: string;
  textContent: string;
}) => {
  return (
    <div className="flex w-full min-w-[164px] items-center gap-2 rounded-sm border bg-white px-4 py-2">
      <div className="rounded-md bg-[#6BA6FF] p-1 text-white">{icon}</div>
      <div className="flex flex-col">
        <span className="whitespace-nowrap text-sm">{title}</span>
        <span className="text-lg">{textContent}</span>
      </div>
    </div>
  );
};

export default CardSection;
