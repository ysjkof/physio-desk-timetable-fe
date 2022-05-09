import { ModifiedGroupMemberWithUser } from ".";
import { useAcceptInvitationMutation } from "../../graphql/generated/graphql";
import { ModifiedLoggedInUser } from "../../hooks/useMe";
import { cls } from "../../libs/utils";
import { DashboardSectionLayout } from "./components/section-layout";
import { DashboardTitle } from "./components/title";

interface MembersProps {
  groupId: number;
  groupName: string;
  members?: ModifiedGroupMemberWithUser[];
  loggedInUser: ModifiedLoggedInUser;
}

export const Members: React.FC<MembersProps> = ({
  groupId,
  groupName,
  members,
  loggedInUser,
}) => {
  const [acceptInvitation] = useAcceptInvitationMutation({
    onCompleted: (data) => {
      console.log("초대수락완료", data);
    },
  });

  return (
    <div className="h-full">
      <DashboardTitle name={groupName} subText="의 구성원" />
      <div className="space-y-16">
        <section className="h-[15.7rem]">
          <DashboardSectionLayout
            title="구성원"
            children={
              <div className="mx-auto w-full max-w-md">
                <div className="grid grid-cols-[2.4rem_1fr_4rem_4rem] gap-3 border-b text-sm">
                  <span className="">권한</span>
                  <span className="">이름</span>
                  <span className=""></span>
                  <span className="text-center">상태</span>
                </div>
                <ul className="space-y-2 overflow-y-scroll">
                  {members?.map((member) => (
                    <div
                      key={member.id}
                      className="grid grid-cols-[2.4rem_1fr_4.2rem_4rem] items-center gap-3 text-sm"
                    >
                      <span className="inline-block w-10 text-xs text-gray-500">
                        {member.manager ? "관리자" : "회원"}
                      </span>
                      <span
                        className={cls(
                          "py-1",
                          loggedInUser.id === member.user.id ? "font-bold" : ""
                        )}
                      >
                        {member.user.name}
                      </span>
                      <div className="mx-auto">
                        {!member.staying &&
                          !member.accepted &&
                          loggedInUser.id === member.user.id && (
                            <button
                              className="btn rounded-md bg-blue-500/90 py-1 px-2 text-white hover:bg-blue-800"
                              type="button"
                              onClick={() =>
                                acceptInvitation({
                                  variables: {
                                    input: {
                                      groupId,
                                    },
                                  },
                                })
                              }
                            >
                              수락하기
                            </button>
                          )}
                      </div>
                      {!member.staying && !member.accepted && (
                        <span className="text-center text-red-500">
                          승인대기
                        </span>
                      )}
                      {member.staying && member.accepted && ""}
                      {!member.staying && member.accepted && "떠난 회원"}
                    </div>
                  ))}
                </ul>
              </div>
            }
          />
        </section>
      </div>
    </div>
  );
};
