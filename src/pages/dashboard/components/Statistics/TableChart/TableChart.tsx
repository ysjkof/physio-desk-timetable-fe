import TableChartCard from './TableChartCard';
import { useTableChart } from './useTableChart';

const TableChart = () => {
  const { countList } = useTableChart();

  return (
    <div className="table-chart w-[270px] gap-4">
      <input className="input" placeholder="치료사 검색" name="searchPatient" />
      <div className="flex w-fit flex-col gap-2">
        {countList &&
          Object.entries(countList).map(([key, value]) => {
            return <TableChartCard key={key} userId={key} {...value} />;
          })}
      </div>
    </div>
  );
};

export default TableChart;
