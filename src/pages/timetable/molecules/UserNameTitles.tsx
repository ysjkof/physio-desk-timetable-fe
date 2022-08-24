import { memo } from 'react';
import { compareDateMatch } from '../../../services/dateServices';
import { cls } from '../../../utils/utils';
import { UserNameTitle } from './UserNameTitle';

interface UserNameTitlesProps {
  userLength: number;
  users: { id: number; name: string; isActivate: boolean }[];
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
        'user-cols-divide relative flex items-center bg-white',
        userLength === 1 ? 'border-x-inherit' : ''
      )}
    >
      {users.map(
        (member, userIndex) =>
          member.isActivate && (
            <UserNameTitle
              key={userIndex}
              isMe={member.id === loginUser}
              name={member.name}
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
  if (
    !(prevProps.userLength === nextProps.userLength) ||
    !(prevProps.clinicId === nextProps.clinicId)
  )
    return false;

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
    return (
      isSameActivate(prevUser.isActivate, updatedUser?.isActivate) &&
      updatedUser
    );
  }).length;

  if (!(prevUsersLength === matchUsersLength)) return false;

  if (!compareDateMatch(prevProps.date, nextProps.date, 'ymd')) return false;

  return true;
});
