import { DailyGraph } from './DailyGraph';
import type { GetStatisticsQuery } from '../../../../../types/generatedTypes';

interface GraphChartProps {
  data: GetStatisticsQuery | undefined;
}

const GraphChart = ({ data }: GraphChartProps) => {
  const dailyReports = data?.getStatistics.dailyReports;

  const graphData = dailyReports?.map(
    ({ cancel, newPatient, date, noshow, reservationCount }) => ({
      x: date,
      y: { cancel, newPatient, noshow, reservationCount },
    })
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
