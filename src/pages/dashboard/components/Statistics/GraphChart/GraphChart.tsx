import { TotalGraph } from './TotalGraph';
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
      <TotalGraph data={graphData} />
      <TotalGraph data={graphData} />
    </div>
  );
};

export default GraphChart;
