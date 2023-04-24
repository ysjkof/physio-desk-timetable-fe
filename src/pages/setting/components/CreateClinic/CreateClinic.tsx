import { Helmet } from 'react-helmet-async';
import FormForCreateClinic from './FormForCreateClinic';
import { SERVICE_NAME } from '../../../../constants/constants';

const CreateClinic = () => {
  return (
    <>
      <Helmet title={`병원 만들기 | ${SERVICE_NAME.ko}`} />
      <div className="px-14 py-10">
        <Title />
        <div className="mt-10 flex w-[460px] flex-col gap-4">
          <FormForCreateClinic />
        </div>
      </div>
    </>
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
