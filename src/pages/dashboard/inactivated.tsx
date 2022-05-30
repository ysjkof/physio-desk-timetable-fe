import { useFindMyClinicsQuery } from "../../graphql/generated/graphql";
import { DashboardMainLayout } from "./components/dashboard-main-layout";
import { DashboardSectionLayout } from "./components/section-layout";
import { DashboardTitle } from "./components/title";

export const InactivatedClinic = () => {
  const { data: findMyClinicsData, loading } = useFindMyClinicsQuery({
    variables: { input: { includeInactivate: true } },
  });

  if (loading) return <></>;
  return (
    <>
      <DashboardTitle
        name="비활성 모임 조회"
        subText="비활성한 모임을 조회합니다."
      />
      <DashboardMainLayout>
        <section className="h-[15.7rem]">
          <DashboardSectionLayout
            title="조회"
            isPadding={true}
            children={
              <>
                <div className="border-b">
                  <span className="">이름</span>
                </div>
                <ul className="space-y-2 overflow-y-scroll">
                  {findMyClinicsData &&
                  Array.isArray(findMyClinicsData.findMyClinics.clinics) &&
                  findMyClinicsData.findMyClinics.clinics.length >= 1
                    ? findMyClinicsData.findMyClinics.clinics.map((clinic) => (
                        <li key={clinic.id} className="">
                          {clinic.name}
                        </li>
                      ))
                    : "검색된 결과가 없습니다."}
                </ul>
              </>
            }
          />
        </section>
      </DashboardMainLayout>
    </>
  );
};
