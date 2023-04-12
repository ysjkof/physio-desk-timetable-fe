import { useGetClinic } from '../../../../hooks';
import FormForInviteUser from './FormForInviteUser';
import { ClinicType } from '../../../../types/generatedTypes';
import { ProtectStayMember, Warning } from '../../../../components';
import { Helmet } from 'react-helmet-async';
import { MUOOL } from '../../../../constants/constants';

const InviteUser = () => {
  const [myClinic] = useGetClinic();

  const isPersonal = myClinic?.type === ClinicType.Personal;

  return (
    <>
      <Helmet title={`직원 초대 | ${MUOOL}`} />
      <ProtectStayMember
        clinicId={myClinic?.id}
        fallback={<Warning type="hasNotPermission" />}
      >
        <div className="h-full w-full overflow-scroll px-10">
          <h1 className="dashboard-menu-title mt-6">직원 초대하기</h1>
          <div className="mt-6 flex max-w-md flex-col gap-4">
            {isPersonal ? (
              <p>개인용 병원은 직원을 초대할 수 없습니다.</p>
            ) : (
              <FormForInviteUser />
            )}
          </div>
        </div>
      </ProtectStayMember>
    </>
  );
};

export default InviteUser;
