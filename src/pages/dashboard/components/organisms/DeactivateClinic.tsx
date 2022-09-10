import { useReactiveVar } from '@apollo/client';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { client } from '../../../../apollo';
import { Worning } from '../../../../components/atoms/Warning';
import { Button } from '../../../../components/molecules/Button';
import { MenuButton } from '../../../../components/molecules/MenuButton';
import {
  FindMyClinicsDocument,
  useInactivateClinicMutation,
} from '../../../../graphql/generated/graphql';
import { selectedInfoVar, toastVar } from '../../../../store';
import { IdAndName } from '../../../../types/type';

interface DeactivateClinicProps extends IdAndName {
  closeAction: () => void;
}

export const DeactivateClinic = ({
  id,
  name,
  closeAction,
}: DeactivateClinicProps) => {
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
        onCompleted(data) {
          if (data.inactivateClinic.ok) {
            client.refetchQueries({ include: [FindMyClinicsDocument] });
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

  return selectedInfo.clinic?.isStayed && selectedInfo.clinic.isManager ? (
    <>
      <p>
        병원을 더 이상 사용하지 않기 때문에 비활성합니다. 비활성하면 정보의
        수정이 불가능합니다.
      </p>
      <MenuButton
        label="동의"
        isCenter
        hasActiveRing
        enabled={agree}
        icon={<FontAwesomeIcon icon={faCheck} fontSize={14} />}
        onClick={() => setAgree((prev) => !prev)}
      />
      <Button canClick={agree} loading={loading} onClick={onClick} isWidthFull>
        비활성하기
      </Button>
    </>
  ) : (
    <Worning type="hasNotPermission" />
  );
};
