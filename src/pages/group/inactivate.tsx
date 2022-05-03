import {
  useFindMyGroupsLazyQuery,
  useFindMyGroupsQuery,
  useInactivateGroupMutation,
} from "../../graphql/generated/graphql";
import { cls } from "../../libs/utils";

interface InactivateGroupProps {
  groupId: number;
  groupName: string;
}

export const InactivateGroup: React.FC<InactivateGroupProps> = ({
  groupId,
  groupName,
}) => {
  const [callQuery, { loading }] = useInactivateGroupMutation();

  const onClick = () => {
    if (!loading && confirm(`${groupName}을(를) 비활성화 합니까?`)) {
      callQuery({
        variables: { input: { groupId } },
      });
    }
  };

  const [
    callFindMyGroups,
    { data: findMyGroupsData, loading: findGroupLoading },
  ] = useFindMyGroupsLazyQuery({
    variables: { input: { includeField: "inactivate" } },
  });

  const onClickSeeInactivatedGroup = () => {
    if (!loading && !findGroupLoading) {
      callFindMyGroups();
    }
  };

  return (
    <div className="h-full">
      <div className="mb-10">
        <div className="mb-4 flex justify-between border-b">
          <div>
            <span className="font-medium">{groupName}</span>
            <span className="text-sm text-gray-500">을 비활성합니다</span>
          </div>
          <button type="button" onClick={onClick} className="btn-border px-4">
            비활성하기
          </button>
        </div>
        <p>
          모임을 더 이상 사용하지 않기 때문에 비활성합니다. 비활성할 경우 정보의
          수정이 불가능합니다.
        </p>
      </div>
      <div className="mb-10">
        <div className="mb-4 flex justify-between border-b">
          <div>
            <span className="font-medium">비활성 모임을 조회합니다</span>
          </div>
          <button
            type="button"
            onClick={onClickSeeInactivatedGroup}
            className="btn-border px-4"
          >
            비활성 모임 보기
          </button>
        </div>
        {findMyGroupsData && (
          <ul className="mb-4 divide-y rounded-md bg-gray-100 p-1">
            {findMyGroupsData.findMyGroups.groups?.map((group) => (
              <li
                key={group.id}
                className={cls("cursor-pointer py-1.5 px-6 font-semibold")}
              >
                {group.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
