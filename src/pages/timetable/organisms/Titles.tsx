import { getActiveUserLength } from '..';
import { compareDateMatch } from '../../../services/dateServices';
import DateTitle from '../molecules/DateTitle';
import { TableLoopTemplate } from '../templates/TableLoopTemplate';
import { DayWithUsers } from '../../../types/type';
import { useMe } from '../../../hooks/useMe';
import useStore from '../../../hooks/useStore';
import UserNameTitles from '../molecules/UserNameTitles';
import { VIEW_PERIOD } from '../../../constants/constants';

interface TitlesProps {
  userFrameForWeek: DayWithUsers[];
}

export function Titles({ userFrameForWeek }: TitlesProps) {
  const today = new Date();
  const { selectedInfo, viewOptions, selectedDate } = useStore();
  const { data: loggedInUser } = useMe();

  const userLength = getActiveUserLength(selectedInfo.clinic?.members);

  const userFrame =
    viewOptions.viewPeriod === VIEW_PERIOD.ONE_DAY
      ? userFrameForWeek && [userFrameForWeek[selectedDate.getDay()]]
      : userFrameForWeek;

  if (userLength === 0) throw new Error('사용자 수가 0입니다');
  return (
    <div className="TABLE_SUB_HEADER sticky top-0 z-[32] shadow-b">
      <TableLoopTemplate
        userLength={userLength}
        children={userFrameForWeek?.map((day, i) => (
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
        children={userFrame.map((day, i) => {
          const users = day.users.map((member) => {
            return {
              id: member.user.id,
              name: member.user.name,
              isActivate: !!member.isActivate,
            };
          });
          return (
            <UserNameTitles
              key={i}
              userLength={userLength}
              users={users}
              loggedInUserId={loggedInUser!.me.id}
              clinicId={selectedInfo.clinic!.id}
              date={day.date}
            />
          );
        })}
      />
    </div>
  );
}
