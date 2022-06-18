import { DashboardLi } from "../components/li";
import { CountLists } from "../organisms/statistics";
import { TableChartCol } from "./table-chart-col";

interface TableChartColLayoutProps {
  labelNames: string[];
  hasLabelTotal?: boolean;
  individualData: {
    userName: string;
    counts: CountLists;
    countTotal?: number;
  }[];
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
            {hasLabelTotal ? (
              <DashboardLi borderTop textCenter textContents={"합계"} />
            ) : (
              ""
            )}
          </>
        }
      />

      {individualData.map((data, idx) => (
        <TableChartCol
          key={idx}
          title={data.userName}
          children={
            <>
              {Object.values(data.counts).map((count, i) => (
                <DashboardLi
                  key={i}
                  textContents={
                    i === 1 ? count.toLocaleString() : count.toLocaleString()
                  }
                />
              ))}
              {typeof data.countTotal === "number" ? (
                <DashboardLi
                  borderTop
                  textContents={data.countTotal.toLocaleString()}
                />
              ) : (
                ""
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
              {counts.map((totalCount, i) => (
                <DashboardLi
                  key={i}
                  textContents={totalCount.toLocaleString()}
                />
              ))}
              {countTotal ? (
                <DashboardLi
                  borderTop
                  textContents={countTotal.toLocaleString()}
                />
              ) : (
                ""
              )}
            </>
          }
        />
      )}
    </div>
  );
};
