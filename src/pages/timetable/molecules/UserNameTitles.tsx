import { memo } from 'react';
import { IUserWithEvent } from '../../../types/type';
import { cls } from '../../../utils/utils';
import { UserNameTitle } from './UserNameTitle';

interface UserNameTitlesProps {
  userLength: number;
  users: IUserWithEvent[];
  clinicId: number;
  loggedInUserId: number;
  date: Date;
}
function UserNameTitles({
  userLength,
  users,
  clinicId,
  loggedInUserId,
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
              isMe={member.user.id === loggedInUserId}
              name={member.user.name}
              userIndex={userIndex}
              clinicId={clinicId}
              userId={member.user.id}
              date={date}
            />
          )
      )}
    </div>
  );
}

export default memo(UserNameTitles);
