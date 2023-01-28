import { useMutation } from '@apollo/client';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { client } from '../../../../apollo';
import { toastVar } from '../../../../store';
import { IdAndName } from '../../../../types/common.types';
import Warning from '../../../../_legacy_components/atoms/Warning';
import Button from '../../../../_legacy_components/molecules/Button';
import MenuButton from '../../../../_legacy_components/molecules/MenuButton';
import {
  FIND_MY_CLINICS_DOCUMENT,
  INACTIVATE_CLINIC_DOCUMENT,
} from '../../../../graphql';
import { ClinicsOfClient } from '../../../../models';
import type { InactivateClinicMutation } from '../../../../types/generated.types';

interface DeactivateClinicProps extends IdAndName {
  closeAction: () => void;
}

export default function DeactivateClinic({
  id,
  name,
  closeAction,
}: DeactivateClinicProps) {
  const selectedClinic = ClinicsOfClient.getSelectedClinic();

  const [agree, setAgree] = useState(false);

  const [mutationInactivateClinic, { loading }] =
    useMutation<InactivateClinicMutation>(INACTIVATE_CLINIC_DOCUMENT);

  const onClick = () => {
    if (!loading && confirm(`다음 병원을 비활성하시겠습니까?\n${name}`)) {
      mutationInactivateClinic({
        variables: { input: { clinicId: id } },
        onCompleted(data) {
          if (data.inactivateClinic.ok) {
            client.refetchQueries({ include: [FIND_MY_CLINICS_DOCUMENT] });
            toastVar({
              messages: [`${name}이 폐쇄됐습니다`],
              fade: true,
              bgColor: true,
            });
          }

          if (data.inactivateClinic.error) {
            toastVar({ messages: [data.inactivateClinic.error] });
          }
          closeAction();
        },
      });
    }
  };

  if (!selectedClinic.isStayed || !selectedClinic.isManager)
    return <Warning type="hasNotPermission" />;

  return (
    <>
      <p>
        병원을 더 이상 사용하지 않기 때문에 비활성합니다. 비활성하면 정보의
        수정이 불가능합니다.
      </p>
      <MenuButton
        isCenter
        hasActiveRing
        enabled={agree}
        onClick={() => setAgree((prev) => !prev)}
      >
        <FontAwesomeIcon icon={faCheck} fontSize={14} />
        동의
      </MenuButton>
      <Button canClick={agree} loading={loading} onClick={onClick} isWidthFull>
        비활성하기
      </Button>
    </>
  );
}
