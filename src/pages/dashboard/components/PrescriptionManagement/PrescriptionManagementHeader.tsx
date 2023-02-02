import { Dispatch } from 'react';
import { TwoLabelSwitch } from '../../../../components';
import SearchAndCreatePrescription from './SearchAndCreatePrescription';

const PrescriptionManagementHeader = ({
  seeInactivate,
  setSeeInactivate,
}: {
  seeInactivate: boolean;
  setSeeInactivate: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const toggleActivate = () => {
    setSeeInactivate((prev) => !prev);
  };

  return (
    <div className="mb-8 flex items-center justify-between gap-6">
      <h1 className="text-2xl font-semibold text-[#262850]">처방목록</h1>
      <div className="flex h-fit items-center">
        <div className="flex items-center gap-x-2 text-xs text-[#333779]">
          <span>비활성 상태</span>
          <TwoLabelSwitch
            labels={['숨기기', '보기']}
            onClick={toggleActivate}
            isActivated={seeInactivate}
          />
        </div>
        <SearchAndCreatePrescription />
      </div>
    </div>
  );
};

export default PrescriptionManagementHeader;
