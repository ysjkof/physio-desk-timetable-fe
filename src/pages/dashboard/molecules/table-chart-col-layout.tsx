import { DashboardLi } from "../components/li";
import { TableChartCol } from "./table-chart-col";

interface TableChartColLayoutProps {
  labelNames: string[];
  hasLabelTotal?: boolean;
  individualData: { name: string; counts: number[]; countTotal?: number }[];
  countTotal?: number;
  counts: number[];
}
export const TableChartColLayout = ({
  labelNames,
  hasLabelTotal,
  individualData,
  countTotal,
  counts,
}: TableChartColLayoutProps) => {
  return (
    <div className="TABLE_CHART_COL_LAYOUT flex px-4">
      <TableChartCol
        title="이름"
        titleBorderRight
        children={
          <>
            {labelNames.map((name, idx) => (
              <DashboardLi
                key={idx}
                textCenter
                borderRight
                textContents={name}
              />
            ))}
            {hasLabelTotal && (
              <DashboardLi borderTop textCenter textContents={"합계"} />
            )}
          </>
        }
      />

      {individualData.map((data) => (
        <TableChartCol
          title={data.name}
          children={
            <>
              {data.counts.map((count, i) => (
                <DashboardLi
                  textContents={i === 1 ? `${count}명` : `${count}번`}
                />
              ))}
              {data.countTotal && (
                <DashboardLi borderTop textContents={`${data.countTotal}번`} />
              )}
            </>
          }
        />
      ))}

      {counts && individualData.length > 1 && (
        <TableChartCol
          title="합계"
          children={
            <>
              {counts.map((totalCount) => (
                <DashboardLi textContents={`${totalCount}번`} />
              ))}
              {countTotal && (
                <DashboardLi borderTop textContents={`${countTotal}번`} />
              )}
            </>
          }
        />
      )}
    </div>
  );
};
