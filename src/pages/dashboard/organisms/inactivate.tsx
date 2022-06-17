import { useReactiveVar } from "@apollo/client";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { InDashboardPageProps } from "..";
import { NotPermission } from "../../../components/atoms/not-permission";
import { Button } from "../../../components/molecules/button";
import { BtnMenu } from "../../../components/molecules/button-menu";
import { useInactivateClinicMutation } from "../../../graphql/generated/graphql";
import { selectedClinicVar } from "../../../store";
import { DashboardSectionLayout } from "../components/section-layout";

export const InactivateClinic = ({ loggedInUser }: InDashboardPageProps) => {
  const selectedClinic = useReactiveVar(selectedClinicVar);
  const [agree, setAgree] = useState(false);

  const [mutationInactivateClinic, { loading }] = useInactivateClinicMutation();

  const onClick = () => {
    if (
      !loading &&
      confirm(`다음 병원을 비활성하시겠습니까?
                          ${name}`)
    ) {
      mutationInactivateClinic({
        variables: { input: { clinicId: selectedClinic?.id ?? 0 } },
      });
    }
  };

  return selectedClinic?.isStayed && selectedClinic.isManager ? (
    <NotPermission />
  ) : (
    <DashboardSectionLayout
      title="병원 비활성"
      width="md"
      moreYGap
      heightFull
      children={
        <>
          <p>
            병원을 더 이상 사용하지 않기 때문에 비활성합니다. 비활성하면 정보의
            수정이 불가능합니다.
          </p>
          <BtnMenu
            label="동의"
            enabled={agree}
            hasBorder
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
      }
    />
  );
};
