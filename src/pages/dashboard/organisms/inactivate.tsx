import { useReactiveVar } from "@apollo/client";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { InDashboardPageProps } from "..";
import { Button } from "../../../components/molecules/button";
import { BtnMenu } from "../../../components/molecules/button-menu";
import { useInactivateClinicMutation } from "../../../graphql/generated/graphql";
import { selectedClinicVar } from "../../../store";
import { DashboardSectionLayout } from "../components/section-layout";

export const InactivateClinic = ({ loggedInUser }: InDashboardPageProps) => {
  const {
    id: clinicId,
    name,
    isStayed,
    isManager,
  } = useReactiveVar(selectedClinicVar);
  const [agree, setAgree] = useState(false);
  if (!isStayed || !isManager) {
    return <h3 className="mt-10 text-center">권한이 없습니다</h3>;
  }
  const [mutationInactivateClinic, { loading }] = useInactivateClinicMutation();

  const onClick = () => {
    if (
      !loading &&
      confirm(`다음 병원을 비활성하시겠습니까?
                          ${name}`)
    ) {
      mutationInactivateClinic({
        variables: { input: { clinicId } },
      });
    }
  };

  return (
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
