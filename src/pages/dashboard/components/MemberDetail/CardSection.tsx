import { ReactNode } from 'react';
import { BriefCase, PersonPlus } from '../../../../svgs';

const CardSection = ({ countOfPatient }: { countOfPatient: number }) => {
  return (
    <div className="flex justify-between gap-x-4 text-[#64648E]">
      <CardInDetail
        icon={<BriefCase className="h-8 w-8" />}
        iconBgColor="#35BEFF"
        title="병원근속년수"
        textContent="2년차"
      />
      <CardInDetail
        icon={<PersonPlus className="h-8 w-8" />}
        iconBgColor="#6BA6FF"
        title="담당환자수"
        textContent={`${countOfPatient}명`}
      />
      <CardInDetail
        icon={
          <div className="h-8 w-8 bg-[url('/images/calendar-with-clock-green.png')]" />
        }
        iconBgColor="#68BB89"
        title="발생한 연차"
        textContent="15일"
      />
      <CardInDetail
        icon={
          <div className="h-8 w-8 bg-[url('/images/calendar-with-clock-red.png')]" />
        }
        iconBgColor="#D85F66"
        title="남은 연차"
        textContent="12일"
      />
    </div>
  );
};

const CardInDetail = ({
  icon,
  iconBgColor,
  title,
  textContent,
}: {
  icon: ReactNode;
  iconBgColor: string;
  title: string;
  textContent: string;
}) => {
  return (
    <div className="flex w-full min-w-[164px] items-center gap-2 rounded-sm border bg-white px-4 py-2">
      <div
        className="rounded-md p-1 text-white"
        style={{ backgroundColor: iconBgColor }}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="whitespace-nowrap text-sm">{title}</span>
        <span className="text-lg">{textContent}</span>
      </div>
    </div>
  );
};

export default CardSection;
