import { useReactiveVar } from '@apollo/client';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Worning } from '../../../components/atoms/Warning';
import { Button } from '../../../components/molecules/Button';
import { MenuButton } from '../../../components/molecules/MenuButton';
import { useInactivateClinicMutation } from '../../../graphql/generated/graphql';
import { selectedInfoVar } from '../../../store';
import { DeactivateClinicInfo } from '../../../types/type';

interface DeactivateClinicProps extends DeactivateClinicInfo {}

export const DeactivateClinic = ({ id, name }: DeactivateClinicProps) => {
  const selectedInfo = useReactiveVar(selectedInfoVar);
  const [agree, setAgree] = useState(false);

  const [mutationInactivateClinic, { loading }] = useInactivateClinicMutation();

  const onClick = () => {
    if (
      !loading &&
      confirm(`다음 병원을 비활성하시겠습니까?
                          ${name}`)
    ) {
      mutationInactivateClinic({
        variables: { input: { clinicId: id } },
      });
    }
  };

  return selectedInfo.clinic?.isStayed && selectedInfo.clinic.isManager ? (
    <>
      <p>
        병원을 더 이상 사용하지 않기 때문에 비활성합니다. 비활성하면 정보의
        수정이 불가능합니다.
      </p>
      <MenuButton
        label="동의"
        enabled={agree}
        hasActiveRing
        icon={<FontAwesomeIcon icon={faCheck} fontSize={14} />}
        onClick={() => setAgree((prev) => !prev)}
        isCenter
      />
      <Button
        canClick={agree}
        loading={loading}
        textContents="비활성하기"
        onClick={onClick}
        isWidthFull
      />
    </>
  ) : (
    <Worning type="hasNotPermission" />
  );
};
