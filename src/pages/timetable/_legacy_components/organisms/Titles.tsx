import { compareDateMatch } from '../../../../services/dateServices';
import DateTitle from '../molecules/DateTitle';
import { DayWithUsers } from '../../../../types/common.types';
import useStore from '../../../../hooks/useStore';
import { VIEW_PERIOD } from '../../../../constants/constants';
import {
  getGridTemplateColumns,
  getTableCellWidth,
} from '../../../timetableServices';

interface TitlesProps {
  userFrameForWeek: DayWithUsers[];
  userLength: number;
}

export default function Titles({ userFrameForWeek, userLength }: TitlesProps) {
  const today = new Date();
  const { viewOptions } = useStore();

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
        style={viewPeriodStyle[viewOptions.get.viewPeriod].dateTitle}
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
    </div>
  );
}
