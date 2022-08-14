import { useEffect, useState } from 'react';
import { getActiveUserLength } from '..';
import {
  compareDateMatch,
  getSunday,
  getWeeks,
} from '../../../services/dateServices';
import DateTitle from '../molecules/DateTitle';
import { TableLoopTemplate } from '../templates/TableLoopTemplate';
import {
  makeUsersInDay,
  spreadClinicMembers,
} from '../../../services/timetableServices';
import { DayWithUsers } from '../../../types/type';
import { useMe } from '../../../hooks/useMe';
import useStore from '../../../hooks/useStore';
import UserNameTitles from '../molecules/UserNameTitles';

interface TitlesProps {}

export function Titles({}: TitlesProps) {
  const today = new Date();
  const { selectedInfo, clinicLists } = useStore();

  const [userFrame, setUserFrame] = useState<DayWithUsers[] | null>(null);

  const userLength = getActiveUserLength(selectedInfo.clinic?.members);

  const { data: loggedInUser } = useMe();

  useEffect(() => {
    if (loggedInUser) {
      const userFrame = makeUsersInDay(
        spreadClinicMembers(clinicLists, selectedInfo.clinic!.id),
        getWeeks(getSunday(selectedInfo.date))
      );
      setUserFrame(userFrame);
    }
  }, [clinicLists, selectedInfo.date, selectedInfo.clinic]);

  if (!userLength) return <></>;
  return (
    <div className="TABLE_SUB_HEADER sticky top-0 z-[32] shadow-b">
      <TableLoopTemplate
        userLength={userLength}
        children={userFrame?.map((day, i) => (
          <DateTitle
            key={i}
            date={day.date}
            isToday={compareDateMatch(today, day.date, 'ymd')}
            userLength={userLength}
          />
        ))}
      />
      <TableLoopTemplate
        userLength={userLength}
        children={userFrame?.map((day, i) => (
          <UserNameTitles
            key={i}
            userLength={userLength}
            users={day.users}
            loggedInUserId={loggedInUser!.me.id}
            clinicId={selectedInfo.clinic!.id}
            date={day.date}
          />
        ))}
      />
    </div>
  );
}
