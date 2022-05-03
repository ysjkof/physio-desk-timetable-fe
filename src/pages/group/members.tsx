import { ModifiedGroupMemberWithUser } from ".";
import { useAcceptInvitationMutation } from "../../graphql/generated/graphql";
import { ModifiedLoggedInUser } from "../../hooks/useMe";
import { cls } from "../../libs/utils";

interface MembersProps {
  groupId: number;
  groupName: string;
  members: ModifiedGroupMemberWithUser[];
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
      <div className="mb-4 border-b">
        <span className="font-medium">{groupName}</span>
        <span className="text-sm text-gray-500">의 구성원</span>
      </div>
      <ul>
        {members.map((member) => (
          <div
            key={member.id}
            className="flex w-full items-center justify-between"
          >
            <div>
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
            </div>
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
                  <span className="text-xs text-red-500">승인대기</span>
                </>
              )}
              {member.staying && member.accepted && ""}
              {!member.staying && member.accepted && "떠난 회원"}
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};
