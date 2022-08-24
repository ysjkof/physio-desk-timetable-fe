import { compareDateMatch } from '../../../services/dateServices';
import DateTitle from '../molecules/DateTitle';
import { DayWithUsers } from '../../../types/type';
import { useMe } from '../../../hooks/useMe';
import useStore from '../../../hooks/useStore';
import UserNameTitles from '../molecules/UserNameTitles';
import { VIEW_PERIOD } from '../../../constants/constants';
import {
  getGridTemplateColumns,
  getTableCellWidth,
} from '../services/timetableServices';

interface TitlesProps {
  userFrameForWeek: DayWithUsers[];
  userLength: number;
}

export function Titles({ userFrameForWeek, userLength }: TitlesProps) {
  const today = new Date();
  const { selectedInfo, viewOptions, selectedDate } = useStore();
  const { data: loginUser } = useMe();

  const userFrame =
    viewOptions.viewPeriod === VIEW_PERIOD.ONE_DAY
      ? userFrameForWeek && [userFrameForWeek[selectedDate.getDay()]]
      : userFrameForWeek;

  const weekGridCol = getGridTemplateColumns(7, getTableCellWidth(userLength));
  const viewPeriodStyle = {
    [VIEW_PERIOD.ONE_DAY]: {
      dateTitle: { gridTemplateColumns: getGridTemplateColumns(7) },
      userNameTitle: {},
    },
    [VIEW_PERIOD.ONE_WEEK]: {
      dateTitle: {
        gridTemplateColumns: weekGridCol,
      },
      userNameTitle: {
        gridTemplateColumns: weekGridCol,
      },
    },
  };

  return (
    <div className="TITLES sticky top-0 z-[32] shadow-b">
      <div
        className="DATE_TITLE grid w-full"
        style={viewPeriodStyle[viewOptions.viewPeriod].dateTitle}
      >
        {userFrameForWeek?.map((day, i) => (
          <DateTitle
            key={i}
            date={day.date}
            isToday={compareDateMatch(today, day.date, 'ymd')}
            userLength={userLength}
          />
        ))}
      </div>
      <div
        className="USER_NAME_TITLE grid w-full"
        style={viewPeriodStyle[viewOptions.viewPeriod].userNameTitle}
      >
        {userFrame.map((day, i) => {
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
              loginUser={loginUser!.me.id}
              clinicId={selectedInfo.clinic!.id}
              date={day.date}
            />
          );
        })}
      </div>
    </div>
  );
}
