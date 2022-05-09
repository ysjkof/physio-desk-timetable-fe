import { useFindMyGroupsQuery } from "../../graphql/generated/graphql";
import { DashboardSectionLayout } from "./components/section-layout";
import { DashboardTitle } from "./components/title";

interface InactivatedGroupProps {}

export const InactivatedGroup: React.FC<InactivatedGroupProps> = () => {
  const { data: findMyGroupsData, loading } = useFindMyGroupsQuery({
    variables: { input: { includeField: "inactivate" } },
  });

  if (loading) return <></>;
  return (
    <div className="h-full">
      <DashboardTitle
        name="비활성 모임 조회"
        subText="비활성한 모임을 조회합니다."
      />
      <div className="space-y-16">
        <section className="h-[15.7rem]">
          <DashboardSectionLayout
            title="조회"
            children={
              <>
                <div className="border-b text-sm">
                  <span className="">이름</span>
                </div>
                <ul className="space-y-2 overflow-y-scroll">
                  {findMyGroupsData &&
                  Array.isArray(findMyGroupsData.findMyGroups.groups) &&
                  findMyGroupsData.findMyGroups.groups.length >= 1
                    ? findMyGroupsData?.findMyGroups?.groups?.map((group) => (
                        <li key={group.id} className="text-sm">
                          {group.name}
                        </li>
                      ))
                    : "검색된 결과가 없습니다."}
                </ul>
              </>
            }
          />
        </section>
      </div>
    </div>
  );
};
