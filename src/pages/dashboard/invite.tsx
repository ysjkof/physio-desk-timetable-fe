import { faSearch, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import {
  SearchUsersByNameInput,
  useInviteGroupMutation,
  useSearchUsersByNameLazyQuery,
} from "../../graphql/generated/graphql";
import { cls } from "../../libs/utils";
import { DashboardTitle } from "./components/title";

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
    <div className="p- h-full">
      <DashboardTitle name={groupName} subText="에 구성원 초대" />
      <div className="space-y-16">
        <section className="mx-auto flex h-[15.7rem] flex-col">
          <div className="flex h-full flex-col gap-2 bg-white p-2 shadow-cst">
            <form
              onSubmit={handleSubmit(onSubmitSearchUsersByName)}
              className="mx-auto max-w-md"
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
            <div className="mx-auto w-full max-w-md space-y-2">
              <div className="flex items-center justify-between border-b">
                <span>이름</span>
                <span>초대하기</span>
              </div>
              <ul
                className={cls(inviteGroupLoading ? "pointer-events-none" : "")}
              >
                {searchUserResults &&
                  searchUserResults.length !== 0 &&
                  searchUserResults.map((user) => (
                    <li
                      key={user.id}
                      className="my-2 flex cursor-pointer items-center justify-between px-3 hover:bg-gray-100"
                      onClick={() =>
                        onClickInviteToGroup(user, groupName, groupId)
                      }
                    >
                      <span>{user.name}</span>
                      <FontAwesomeIcon icon={faUserPlus} />
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
