import FormForCreateClinic from './FormForCreateClinic';

const CreateClinic = () => {
  return (
    <div className="px-14 py-10">
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
