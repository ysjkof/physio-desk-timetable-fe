import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loading } from "../../../components/atoms/loading";
import { useFindMyClinicsQuery } from "../../../graphql/generated/graphql";
import { DashboardSectionLayout } from "../components/section-layout";

export const InactivatedClinic = () => {
  const { data: findMyClinicsData, loading } = useFindMyClinicsQuery({
    variables: { input: { includeInactivate: true } },
  });

  return loading ? (
    <Loading />
  ) : (
    <DashboardSectionLayout
      title="비활성 병원 보기"
      width="md"
      heightFull
      tooltip="가입했던 병원의 활성화 상태를 봅니다"
      children={
        <>
          <div className="grid grid-cols-[1fr_4rem] justify-between  border-b">
            <span className="">이름</span>
            <span className="text-center">활성상태</span>
          </div>
          <ul className="space-y-2 overflow-y-scroll">
            {findMyClinicsData?.findMyClinics.clinics?.length === 0 ? (
              <p className="py-10 text-center font-semibold">목록이 없습니다</p>
            ) : (
              findMyClinicsData?.findMyClinics.clinics?.map((clinic) => (
                <li
                  key={clinic.id}
                  className="group relative grid grid-cols-[1fr_4rem] items-center"
                >
                  <span className="">{clinic.name}</span>
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    fontSize="large"
                    className={`cursor-pointer" mx-auto ${
                      clinic.isActivated ? "text-green-500" : ""
                    }`}
                  />
                </li>
              ))
            )}
          </ul>
        </>
      }
    />
  );
};
