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
              <>
                <div className="grid grid-cols-[2.4rem_1fr_3.3rem_1.75rem] gap-3 border-b text-sm">
                  <span className="">권한</span>
                  <span className="">이름</span>
                  <span className="text-right">소요시간</span>
                  <span className="text-center">활성</span>
                </div>
                <ul className="space-y-2 overflow-y-scroll">
                  {members?.map((member) => (
                    <div
                      key={member.id}
                      className="grid grid-cols-[2.4rem_1fr_3.3rem_1.75rem] items-center gap-3 text-sm"
                    >
                      <span className="inline-block w-10 text-xs text-gray-500">
                        {member.manager ? "관리자" : "회원"}
                      </span>
                      <span
                        className={cls(
                          loggedInUser.id === member.user.id ? "font-bold" : ""
                        )}
                      >
                        {member.user.name}
                      </span>
                      <div className="flex items-center">
                        {!member.staying && !member.accepted && (
                          <>
                            {loggedInUser.id === member.user.id && (
                              <button
                                className="btn-sm mr-4"
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
                            <span className="text-xs text-red-500">
                              승인대기
                            </span>
                          </>
                        )}
                        {member.staying && member.accepted && ""}
                        {!member.staying && member.accepted && "떠난 회원"}
                      </div>
                    </div>
                  ))}
                </ul>
              </>
            }
          />
        </section>
      </div>
    </div>
  );
};
