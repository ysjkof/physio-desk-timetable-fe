import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { InDashboardPageProps } from "..";
import { Loading } from "../../../components/atoms/loading";
import { ModalTemplate } from "../../../components/molecules/modal-template";
import { ModalContentsLayout } from "../../../components/templates/modal-contents-layout";
import { useFindMyClinicsQuery } from "../../../graphql/generated/graphql";
import { cls } from "../../../libs/utils";
import { DashboardSectionLayout } from "../components/section-layout";
import { DeactivateClinic } from "./deactivate";

export interface DeactivateClinicInfo {
  id: number;
  name: string;
}

const isPersonalClinic = (
  compareMemberId: number,
  psersonalClinicMemberId: number
) => compareMemberId === psersonalClinicMemberId;

export const MyClinics = ({ loggedInUser }: InDashboardPageProps) => {
  const [hasDeactivate, setHasDeactivate] = useState(false);
  const [deactivateClinic, setDeactivateClinic] =
    useState<DeactivateClinicInfo>({
      id: 0,
      name: "",
    });

  const { data: findMyClinicsData, loading } = useFindMyClinicsQuery({
    variables: { input: { includeInactivate: true } },
  });

  const personalClinic = findMyClinicsData?.findMyClinics.clinics?.find(
    (clinic) => clinic.type === "Personal"
  )!;

  const myMembership = findMyClinicsData?.findMyClinics.clinics
    ?.map((clinic) => clinic.members.flat(1))
    .flat(1)
    .filter((member) => member.user.id === loggedInUser.id);

  const openDeactivate = ({ id, name }: DeactivateClinicInfo) => {
    setDeactivateClinic({ id, name });
    setHasDeactivate(true);
  };
  console.log();

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
            <div className="grid grid-cols-[1fr_4rem_4rem] justify-between  border-b">
              <span className="">이름</span>
              <span className="text-center">활성상태</span>
              <span className="text-center">비활성하기</span>
            </div>
            <ul className="space-y-2">
              {myMembership?.length === 0 ? (
                <p className="py-10 text-center font-semibold">
                  목록이 없습니다
                </p>
              ) : (
                myMembership?.map((member) => (
                  <li
                    key={member.id}
                    className="group relative grid grid-cols-[1fr_4rem_4rem] items-center"
                  >
                    <span className="">{member.clinic.name}</span>
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      fontSize="large"
                      className={cls(
                        "mx-auto",
                        findMyClinicsData?.findMyClinics.clinics?.find(
                          (clinic) => clinic.id === member.clinic.id
                        )?.isActivated
                          ? "text-green-500"
                          : ""
                      )}
                    />
                    {isPersonalClinic(
                      member.id,
                      personalClinic.members[0].id
                    ) || (
                      <FontAwesomeIcon
                        icon={faClose}
                        fontSize="large"
                        onClick={() =>
                          openDeactivate({
                            id: member.clinic.id,
                            name: member.clinic.name,
                          })
                        }
                        className={cls(
                          "mx-auto cursor-pointer",
                          member.manager
                            ? "text-red-500"
                            : "pointer-events-none opacity-50"
                        )}
                      />
                    )}
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
