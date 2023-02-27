import { DailyGraph } from './DailyGraph';
import { sumObjValue } from '../../../../../utils/chartUtils';
import { Warning } from '../../../../../components';
import type { GraphChartProps } from '../../../../../types/propsTypes';
import type { GraphData } from '../../../../../types/commonTypes';

const GraphChart = ({ data, disabledIds }: GraphChartProps) => {
  const iniValue = {
    cancel: 0,
    newPatient: 0,
    noshow: 0,
    reservationCount: 0,
  };

  let graphData: GraphData[] | undefined;

  if (disabledIds.size === 0) {
    graphData = data?.getStatistics.dailyReports?.map(
      ({ date, cancel, newPatient, noshow, reservationCount }) => {
        return {
          x: date,
          y: { cancel, newPatient, noshow, reservationCount },
        };
      }
    );
  } else {
    graphData = data?.getStatistics.dailyReports?.map(({ date, users }) => {
      const y = users
        .filter((user) => !disabledIds.has(user.userId))
        .reduce((acc, cur) => sumObjValue(acc, cur), iniValue);

      return {
        x: date,
        y,
      };
    });
  }

  if (graphData?.length === 0)
    return (
      <div className="h-full w-full">
        <Warning>통계 내역이 없습니다</Warning>
      </div>
    );

  return (
    <div className="graph-chart">
      <DailyGraph data={graphData} type="reservationCount" />
      <DailyGraph data={graphData} type="cancel" />
      <DailyGraph data={graphData} type="noshow" />
      <DailyGraph data={graphData} type="newPatient" />
    </div>
  );
};

export default GraphChart;
