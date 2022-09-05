import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Loading } from '../../../../components/atoms/Loading';
import { ModalTemplate } from '../../../../components/templates/ModalTemplate';
import { ModalContentsLayout } from '../../../../components/templates/ModalContentsLayout';
import { useFindMyClinicsQuery } from '../../../../graphql/generated/graphql';
import { DeactivateClinicInfo } from '../../../../types/type';
import { checkMember, cls } from '../../../../utils/utils';
import { DashboardSectionLayout } from '../template/DashboardSectionLayout';
import { DeactivateClinic } from './DeactivateClinic';
import { useMe } from '../../../../hooks/useMe';
import { Button } from '../../../../components/molecules/Button';
import useAcceptInvitation from '../../hooks/useAcceptInvitation';
import useCancelInvitation from '../../hooks/useCancelInvitation';

const isPersonalClinic = (
  compareMemberId: number,
  psersonalClinicMemberId: number
) => compareMemberId === psersonalClinicMemberId;

export const MyClinics = () => {
  const { acceptInvitation, loading: acceptLoading } = useAcceptInvitation();
  const { invokeCancelInvitation } = useCancelInvitation();

  const { data } = useMe();
  const [hasDeactivate, setHasDeactivate] = useState(false);
  const [deactivateClinic, setDeactivateClinic] =
    useState<DeactivateClinicInfo>({
      id: 0,
      name: '',
    });

  const { data: findMyClinicsData, loading } = useFindMyClinicsQuery({
    variables: { input: { includeInactivate: true } },
  });

  const personalClinic = findMyClinicsData?.findMyClinics.clinics?.find(
    (clinic) => clinic.type === 'Personal'
  )!;

  const myMembership = findMyClinicsData?.findMyClinics.clinics
    ?.map((clinic) => clinic.members.flat(1))
    .flat(1)
    .filter((member) => member.user.id === data?.me.id);

  const openDeactivate = ({ id, name }: DeactivateClinicInfo) => {
    setDeactivateClinic({ id, name });
    setHasDeactivate(true);
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      <DashboardSectionLayout
        title="나의 병원"
        width="md"
        heightFull
        tooltip="현재까지 병원 목록을 봅니다"
        children={
          <>
            <div className="grid grid-cols-[1fr_1fr_4rem_4rem_4rem] justify-between  border-b border-b-black">
              <span>이름</span>
              <span></span>
              <span className="text-center">상태</span>
              <span className="text-center">역할</span>
              <span className="text-center">폐쇄</span>
            </div>
            <ul className="divide-y">
              {myMembership?.length === 0 ? (
                <p className="py-10 text-center font-semibold">
                  목록이 없습니다
                </p>
              ) : (
                myMembership?.map((member) => (
                  <li
                    key={member.id}
                    className="group relative grid grid-cols-[1fr_1fr_4rem_4rem_4rem] items-center py-2"
                  >
                    <span className="text-ellipsis whitespace-nowrap">
                      {member.clinic.name}
                    </span>
                    <div className="flex gap-2">
                      {checkMember(member.staying, member.accepted) ===
                        '수락대기' && (
                        <>
                          <Button
                            loading={acceptLoading}
                            canClick={!acceptLoading}
                            isSmall
                            onClick={() => acceptInvitation(member.clinic.id)}
                          >
                            초대 수락
                          </Button>
                          <Button
                            loading={acceptLoading}
                            canClick={!acceptLoading}
                            isSmall
                            onClick={() => invokeCancelInvitation(member.id)}
                          >
                            거절
                          </Button>
                        </>
                      )}
                    </div>
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      fontSize="large"
                      className={cls(
                        'mx-auto',
                        findMyClinicsData?.findMyClinics.clinics?.find(
                          (clinic) => clinic.id === member.clinic.id
                        )?.isActivated
                          ? 'text-green-500'
                          : ''
                      )}
                    />
                    <span className="text-center">
                      {checkMember(member.staying, member.accepted)}
                    </span>
                    {isPersonalClinic(
                      member.id,
                      personalClinic.members[0].id
                    ) ||
                      (member.manager && (
                        <Button
                          type="button"
                          loading={false}
                          isSmall
                          canClick={member.manager}
                          onClick={() =>
                            openDeactivate({
                              id: member.clinic.id,
                              name: member.clinic.name,
                            })
                          }
                        >
                          실행
                        </Button>
                      ))}
                  </li>
                ))
              )}
            </ul>
          </>
        }
      />
      {hasDeactivate && (
        <ModalTemplate
          isSmallChildren
          closeAction={() => setHasDeactivate(false)}
          children={
            <ModalContentsLayout
              title="병원 비활성하기"
              closeAction={() => setHasDeactivate(false)}
              children={
                <DeactivateClinic
                  id={deactivateClinic.id}
                  name={deactivateClinic.name}
                />
              }
            />
          }
        />
      )}
    </>
  );
};
