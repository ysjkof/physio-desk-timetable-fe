import { lazy, useState } from 'react';
import { useQuery } from '@apollo/client';
import { getMemberState, renameUseSplit } from '../../../../utils/utils';
import { useMe } from '../../../../hooks/useMe';
import useAcceptInvitation from '../../hooks/useAcceptInvitation';
import useCancelInvitation from '../../hooks/useCancelInvitation';
import DeactivateClinic from './DeactivateClinic';
import ClinicCard from '../molecules/ClinicCard';
import ModalTemplate from '../../../../_legacy_components/templates/ModalTemplate';
import ModalContentsLayout from '../../../../_legacy_components/templates/ModalContentsLayout';
import { FIND_MY_CLINICS_DOCUMENT } from '../../../../graphql';
import {
  FindMyClinicsQuery,
  ClinicType,
} from '../../../../types/generated.types';
import type { IdAndName } from '../../../../types/common.types';
const Loading = lazy(
  () => import('../../../../_legacy_components/atoms/Loading')
);

interface CanClose {
  isActivated: boolean;
  isManager: boolean;
  clinicType: ClinicType;
}

export default function MyClinics() {
  const { acceptInvitation, loading: acceptLoading } = useAcceptInvitation();
  const { invokeCancelInvitation, loading: cancelLoading } =
    useCancelInvitation();

  const { data } = useMe();
  const [hasDeactivate, setHasDeactivate] = useState(false);
  const [deactivateClinic, setDeactivateClinic] = useState<IdAndName>({
    id: 0,
    name: '',
  });

  const { data: findMyClinicsData, loading } = useQuery<FindMyClinicsQuery>(
    FIND_MY_CLINICS_DOCUMENT,
    {
      variables: { input: { includeInactivate: true } },
    }
  );

  const clinicsExcludeOtherMember =
    findMyClinicsData?.findMyClinics.clinics?.map((clinic) => {
      const { id, isActivated, name, type } = clinic;
      return {
        id,
        isActivated,
        name,
        type,
        member: clinic.members
          .flat(1)
          .flat(1)
          .find((member) => member.user.id === data?.me.id)!,
      };
    });

  const openDeactivate = ({ id, name }: IdAndName) => {
    setDeactivateClinic({ id, name });
    setHasDeactivate(true);
  };

  const canClose = ({ isActivated, isManager, clinicType }: CanClose) =>
    isActivated && isManager && clinicType === ClinicType.Group;

  if (loading) return <Loading />;

  return (
    <section className="px-10 py-8">
      <ClinicCard.Container>
        {clinicsExcludeOtherMember?.map((clinic) => (
          <ClinicCard
            key={clinic.id}
            clinicName={renameUseSplit(clinic.name)}
            state={getMemberState(
              clinic.member.staying,
              clinic.member.accepted,
              clinic.member.manager
            )}
            isActivate={clinic.isActivated}
          >
            <ClinicCard.ButtonContainer>
              {getMemberState(clinic.member.staying, clinic.member.accepted) ===
                '승인대기' && (
                <>
                  <ClinicCard.Button
                    loading={acceptLoading}
                    onClick={() => acceptInvitation(clinic.id)}
                  >
                    <div className="mr-2 h-5 w-5 bg-check" />
                    초대 수락
                  </ClinicCard.Button>
                  <ClinicCard.Button
                    loading={cancelLoading}
                    onClick={() => invokeCancelInvitation(clinic.id)}
                  >
                    <div className="mr-2 h-5 w-5 bg-no" />
                    거절
                  </ClinicCard.Button>
                </>
              )}
              {canClose({
                isActivated: clinic.isActivated,
                isManager: clinic.member.manager,
                clinicType: clinic.type,
              }) && (
                <ClinicCard.Button
                  onClick={() =>
                    openDeactivate({
                      id: clinic.id,
                      name: clinic.name,
                    })
                  }
                >
                  <div className="mr-2 h-5 w-5 bg-lock-closed" />
                  폐쇄하기
                </ClinicCard.Button>
              )}
            </ClinicCard.ButtonContainer>
          </ClinicCard>
        ))}
      </ClinicCard.Container>

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
                  closeAction={() => setHasDeactivate(false)}
                />
              }
            />
          }
        />
      )}
    </section>
  );
}
