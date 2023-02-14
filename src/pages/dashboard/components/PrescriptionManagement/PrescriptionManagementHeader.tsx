import { Dispatch } from 'react';
import { TwoLabelSwitch } from '../../../../components';
import CreatePrescriptionButton from './CreatePrescriptionButton';

const PrescriptionManagementHeader = ({
  seeInactivate,
  setSeeInactivate,
  count = 0,
  maximumCount = 10,
}: {
  seeInactivate: boolean;
  setSeeInactivate: Dispatch<React.SetStateAction<boolean>>;
  count: number | undefined;
  maximumCount: number | undefined;
}) => {
  const toggleActivate = () => {
    setSeeInactivate((prev) => !prev);
  };

  return (
    <div className="mb-8 flex items-center justify-between gap-6">
      <div className="flex items-baseline gap-2">
        <h1 className="text-2xl font-semibold text-[#262850]">처방목록</h1>
        <span className="text-[#8D8DAD]">
          {count}/{maximumCount}
        </span>
      </div>
      <div className="flex h-fit items-center">
        <div className="flex items-center gap-x-2 text-xs text-[#333779]">
          <span>비활성 상태</span>
          <TwoLabelSwitch
            labels={['숨기기', '보기']}
            onClick={toggleActivate}
            isActivated={seeInactivate}
          />
        </div>
        <div className="flex items-center justify-between gap-4 px-4">
          {/* <SearchPrescription /> */}
          <CreatePrescriptionButton />
        </div>
      </div>
    </div>
  );
};

export default PrescriptionManagementHeader;
