import { InDashboardPageProps } from ".";
import { useInactivateGroupMutation } from "../../graphql/generated/graphql";
import { DashboardSectionLayout } from "./components/section-layout";
import { DashboardTitle } from "./components/title";

export const InactivateGroup = ({
  id,
  name,
  isStayed,
  isManager,
  members,
  loggedInUser,
}: InDashboardPageProps) => {
  if (!isStayed || !isManager) {
    return <h3 className="mt-10 text-center text-xl">권한이 없습니다</h3>;
  }
  const [mutationInactivateGroup, { loading }] = useInactivateGroupMutation();

  const onClick = () => {
    if (!loading && confirm(`${name}을(를) 비활성화 합니까?`)) {
      mutationInactivateGroup({
        variables: { input: { groupId: id } },
      });
    }
  };

  return (
    <div className="h-full">
      <DashboardTitle name={name} subText="모임을 비활성합니다" />
      <div className="space-y-16">
        <section className="h-[15.7rem]">
          <DashboardSectionLayout
            title="병원 비활성"
            width="md"
            isPadding={true}
            children={
              <>
                <p>
                  모임을 더 이상 사용하지 않기 때문에 비활성합니다. 비활성하면
                  정보의 수정이 불가능합니다.
                </p>
                <button
                  type="button"
                  onClick={onClick}
                  className="btn-border px-4"
                >
                  비활성하기
                </button>
              </>
            }
          />
        </section>
      </div>
    </div>
  );
};
