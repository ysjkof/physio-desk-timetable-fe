import { useGetClinic } from '../../../../hooks';
import FormForInviteUser from './FormForInviteUser';
import { ClinicType } from '../../../../types/generatedTypes';

const InviteUser = () => {
  const [myClinic] = useGetClinic();

  const isPersonal = myClinic?.type === ClinicType.Personal;

  return (
    <div className="h-full w-full overflow-scroll px-14 py-10">
      <Title />
      <div className="mt-10 flex max-w-md flex-col gap-4">
        {isPersonal ? (
          <p>개인용 병원은 직원을 초대할 수 없습니다.</p>
        ) : (
          <FormForInviteUser />
        )}
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
