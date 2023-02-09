import { useOutletContext } from 'react-router-dom';
import FormForCreateClinic from './FormForCreateClinic';
import type { SettingOutletContext } from '../../../../types/common.types';

const CreateClinic = () => {
  const { outletWidth } = useOutletContext<SettingOutletContext>();

  return (
    <div style={{ width: outletWidth }} className="px-14 py-10">
      <Title />
      <div className="mt-10 flex w-[460px] flex-col gap-4">
        <FormForCreateClinic />
      </div>
    </div>
  );
};

const Title = () => {
  return (
    <div className="flex flex-col items-baseline">
      <h1 className="text-2xl font-semibold text-[#262850]">병원 만들기</h1>
    </div>
  );
};

export default CreateClinic;
