import { useReactiveVar } from '@apollo/client';
import { useEffect, useState } from 'react';
import { getActiveUserLength } from '..';
import { getSunday, getWeeks } from '../../../services/dateServices';
import { cls } from '../../../utils/utils';
import {
  clinicListsVar,
  selectedClinicVar,
  selectedDateVar,
} from '../../../store';
import { UserNameTitle } from '../molecules/UserNameTitle';
import { DateTitle } from '../molecules/DateTitle';
import { TableLoopTemplate } from '../templates/TableLoopTemplate';
import {
  makeUsersInDay,
  spreadClinicMembers,
} from '../../../services/timetableServices';
import { DayWithUsers } from '../../../types/type';
import { useMe } from '../../../hooks/useMe';
import useStore from '../../../hooks/useStore';

interface TitlesProps {}

export function Titles({}: TitlesProps) {
  const { selectedInfo } = useStore();
  const selectedDate = useReactiveVar(selectedDateVar);
  const clinicLists = useReactiveVar(clinicListsVar);
  const [userFrame, setUserFrame] = useState<DayWithUsers[] | null>(null);
  const userLength =
    userFrame && getActiveUserLength(selectedInfo.clinic?.members);

  const { data: loggedInUser } = useMe();

  useEffect(() => {
    if (loggedInUser) {
      const userFrame = makeUsersInDay(
        spreadClinicMembers(clinicLists, selectedInfo.clinic!.id),
        getWeeks(getSunday(selectedDate))
      );
      setUserFrame(userFrame);
    }
  }, [clinicLists, selectedDate, selectedInfo.clinic]);

  if (!userLength) return <></>;
  return (
    <div className="TABLE_SUB_HEADER sticky top-0 z-[32] shadow-b">
      <TableLoopTemplate
        userLength={userLength}
        children={userFrame?.map((day, i) => (
          <DateTitle key={i} date={day.date} userLength={userLength} />
        ))}
      />
      <TableLoopTemplate
        userLength={userLength}
        children={userFrame?.map((day, i) => (
          <div
            key={i}
            className={cls(
              'user-cols-divide relative flex items-center bg-white',
              userLength === 1 ? 'border-x-inherit' : ''
            )}
          >
            {day?.users.map(
              (member, userIndex) =>
                member.isActivate && (
                  <UserNameTitle
                    key={userIndex}
                    isMe={member.user.name === loggedInUser?.me.name}
                    name={member.user.name}
                    userIndex={userIndex}
                    clinicId={selectedInfo.clinic?.id ?? 0}
                    userId={member.user.id}
                    date={day.date}
                  />
                )
            )}
          </div>
        ))}
      />
    </div>
  );
}
