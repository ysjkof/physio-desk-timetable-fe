import { memo } from 'react';
import { compareDateMatch } from '../../../../utils/date.utils';
import { cls } from '../../../../utils/utils';
import { getGridTemplateColumns } from '../../../../styles/timetable.styles';
import UserNameTitle from './UserNameTitle';
import type { UserWithEvent } from '../../../../types/common.types';

interface UserNameTitlesProps {
  userLength: number;
  users: UserWithEvent[];
  clinicId: number;
  loginUser: number;
  date: Date;
}
function UserNameTitles({
  userLength,
  users,
  clinicId,
  loginUser,
  date,
}: UserNameTitlesProps) {
  return (
    <div
      className={cls(
        'UserNameTitles user-cols-divide relative grid items-center bg-white',
        userLength === 1 ? 'border-x-inherit' : ''
      )}
      style={{
        gridTemplateColumns: getGridTemplateColumns(userLength),
      }}
    >
      {users.map(
        (member, userIndex) =>
          member.canSee && (
            <UserNameTitle
              key={userIndex}
              isMe={member.id === loginUser}
              name={member.user.name}
              userIndex={userIndex}
              clinicId={clinicId}
              userId={member.id}
              date={date}
            />
          )
      )}
    </div>
  );
}

export default memo(UserNameTitles, (prevProps, nextProps) => {
  if (!(prevProps.clinicId === nextProps.clinicId)) return false;

  const prevUsersLength = prevProps.users.length;
  if (!(prevUsersLength === nextProps.users.length)) return false;

  const isSameActivate = (
    firstState: boolean | undefined,
    secondState: boolean | undefined
  ) => firstState === secondState;

  const matchUsersLength = prevProps.users.filter((prevUser) => {
    const updatedUser = nextProps.users.find(
      (nextUser) => nextUser.id === prevUser.id
    );
    return isSameActivate(prevUser.canSee, updatedUser?.canSee) && updatedUser;
  }).length;

  if (!(prevUsersLength === matchUsersLength)) return false;

  if (!compareDateMatch(prevProps.date, nextProps.date, 'ymd')) return false;

  return true;
});
