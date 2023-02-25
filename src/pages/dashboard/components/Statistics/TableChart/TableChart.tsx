import TableChartCard from './TableChartCard';

const TableChart = () => {
  return (
    <div className="table-chart w-[270px] gap-4">
      <input className="input" placeholder="치료사 검색" name="searchPatient" />
      <div className="flex w-fit flex-col gap-2">
        <TableChartCard />
        <TableChartCard />
        <TableChartCard />
        <TableChartCard />
        <TableChartCard />
      </div>
    </div>
  );
};

export default TableChart;
