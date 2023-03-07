import { Dispatch } from 'react';
import { TwoLabelSwitch } from '../../../../components';
import CreatePrescriptionButton from './CreatePrescriptionButton';

const PrescriptionManagementController = ({
  seeInactivation,
  setSeeInactivation,
}: {
  seeInactivation: boolean;
  setSeeInactivation: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const toggleActivation = () => {
    setSeeInactivation((prev) => !prev);
  };

  return (
    <div className="flex gap-x-6">
      <div className="flex items-center gap-2 text-xs text-[#333779]">
        <span>비활성 상태</span>
        <TwoLabelSwitch
          labels={['숨기기', '보기']}
          onClick={toggleActivation}
          isActive={seeInactivation}
        />
      </div>
      <div>
        {/* <SearchPrescription /> */}
        <CreatePrescriptionButton />
      </div>
    </div>
  );
};

export default PrescriptionManagementController;
