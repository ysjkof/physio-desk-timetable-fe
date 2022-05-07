import { faSearch, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import {
  SearchUsersByNameInput,
  useInviteGroupMutation,
  useSearchUsersByNameLazyQuery,
} from "../../graphql/generated/graphql";
import { cls } from "../../libs/utils";

interface InviteGroupProps {
  groupId: number;
  groupName: string;
}

export const InviteGroup: React.FC<InviteGroupProps> = ({
  groupId,
  groupName,
}) => {
  const { register, handleSubmit, getValues } = useForm<SearchUsersByNameInput>(
    { mode: "onChange" }
  );

  const [inviteGroupMutation, { loading: inviteGroupLoading }] =
    useInviteGroupMutation();

  const onClickInviteToGroup = (
    user: {
      id: number;
      name: string;
      email: string;
    },
    groupName: string,
    groupId: number
  ) => {
    if (confirm(`${groupName}에 ${user.name}을(를) 그룹에 초대합니까?`)) {
      inviteGroupMutation({
        variables: { input: { groupId, userIds: [user.id] } },
      });
    }
  };

  const [
    searchUsersByName,
    { data: searchUsersByNameData, loading: searchUserByNameLoading },
  ] = useSearchUsersByNameLazyQuery();

  const onSubmitSearchUsersByName = () => {
    if (!searchUserByNameLoading) {
      const { name } = getValues();
      searchUsersByName({
        variables: {
          input: { name },
        },
      });
    }
  };
  const searchUserResults = searchUsersByNameData?.searchUsersByName.results;

  return (
    <div className="h-full">
      <div className="mb-4 border-b">
        <span className="font-medium">{groupName}</span>
        <span className="text-sm text-gray-500">에 구성원 초대</span>
      </div>
      <form
        onSubmit={handleSubmit(onSubmitSearchUsersByName)}
        className="mx-auto max-w-sm pt-4"
      >
        <div className="relative flex items-center shadow-sm">
          <input
            {...register("name", {
              required: "Username is required",
            })}
            id="search-user"
            required
            type="text"
            placeholder="사용자 검색"
            className={cls("input py-1")}
            autoComplete="off"
          />
          <label
            htmlFor="icon-search"
            className="absolute right-0 mr-4 cursor-pointer"
          >
            <input
              id="icon-search"
              type="submit"
              value={""}
              tabIndex={-1}
              className="absolute"
            />
            <FontAwesomeIcon icon={faSearch} />
          </label>
        </div>
        {/* 할일: 초대하기는 매니저만 가능하게 하기 */}
      </form>
      <ul
        className={cls(
          "mx-auto flex max-w-md flex-col rounded-md",
          inviteGroupLoading ? "pointer-events-none" : ""
        )}
      >
        <div className="flex items-center justify-between border-b py-2">
          <span>이름</span>
          <span>초대하기</span>
        </div>
        {searchUserResults &&
          searchUserResults.length !== 0 &&
          searchUserResults.map((user) => (
            <li
              key={user.id}
              className="flex cursor-pointer items-center justify-between border-b px-4 py-2 hover:bg-gray-100"
              onClick={() => onClickInviteToGroup(user, groupName, groupId)}
            >
              <span>{user.name}</span>
              <FontAwesomeIcon icon={faUserPlus} />
            </li>
          ))}
      </ul>
    </div>
  );
};
