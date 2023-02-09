import FormForInviteUser from './FormForInviteUser';

const InviteUser = () => {
  return (
    <div className="h-full w-full overflow-scroll px-14 py-10">
      <Title />
      <div className="mt-10 flex w-[460px] flex-col gap-4">
        <FormForInviteUser />
      </div>
    </div>
  );
};

const Title = () => {
  return (
    <div className="flex flex-col items-baseline">
      <h1 className="whitespace-nowrap text-2xl font-semibold text-[#262850]">
        직원 초대하기
      </h1>
    </div>
  );
};

export default InviteUser;
