import { compareDateMatch } from '../../../../services/dateServices';
import { cls } from '../../../../utils/utils';
import { TimeIndicatorBar } from './TimeIndicatorBar';
import { DayWithUsers } from '../../../../types/type';
import useStore from '../../../../hooks/useStore';
import ReservationButtons from '../molecules/ReservationButtons';
import ScheduleInUserInDay from '../molecules/ScheduleInUserInDay';
import { VIEW_PERIOD } from '../../../../constants/constants';
import { getGridTemplateColumns } from '../../../timetableServices';

interface SchedulesProps {
  weekEvents: DayWithUsers[];
  labels: string[];
  userLength: number;
}
function Schedules({ weekEvents, labels, userLength }: SchedulesProps) {
  const { viewOptions, selectedDate } = useStore();

  const labelMaxLength = labels.length;

  const schedules =
    viewOptions.get.viewPeriod === VIEW_PERIOD.ONE_DAY
      ? weekEvents && [weekEvents[selectedDate.getDay()]]
      : weekEvents;

  const userGridCol = getGridTemplateColumns(userLength);
  const viewPeriodStyle = {
    [VIEW_PERIOD.ONE_DAY]: {
      template: {},
      userColumn: {
        gridTemplateColumns: userGridCol,
      },
    },
    [VIEW_PERIOD.ONE_WEEK]: {
      template: {
        gridTemplateColumns: getGridTemplateColumns(7, userLength * 6),
      },
      userColumn: {
        gridTemplateColumns: userGridCol,
      },
    },
  };

  return (
    <div
      className="SCHEDULES grid w-full"
      style={viewPeriodStyle[viewOptions.get.viewPeriod].template}
    >
      {schedules.map((day, i) => (
        <div
          key={i}
          className={cls(
            'USER_COLS user-cols-divide relative grid border-b',
            userLength === 1 ? 'border-x-inherit' : ''
          )}
          style={viewPeriodStyle[viewOptions.get.viewPeriod].userColumn}
        >
          <TimeIndicatorBar
            isActive={compareDateMatch(day.date, selectedDate, 'ymd')}
          />
          {day.users.map((member, userIndex) => {
            return (
              member.isActivate && (
                <div
                  key={member.id}
                  className="USER_COL relative w-full border-r-[0.5px] last:border-r-0 hover:border-transparent hover:bg-gray-200/50"
                >
                  <ReservationButtons
                    labelMaxLength={labelMaxLength}
                    date={day.date}
                    labels={labels}
                    userId={member.user.id}
                    userIndex={userIndex}
                  />
                  <ScheduleInUserInDay
                    labelMaxLength={labelMaxLength}
                    labels={labels}
                    events={member.events}
                    userIndex={userIndex}
                  />
                </div>
              )
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Schedules;
