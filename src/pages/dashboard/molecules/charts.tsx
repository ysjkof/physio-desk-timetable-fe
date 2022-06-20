import { DashboardSectionLayout } from "../components/section-layout";
import { getHowManyDayFromMillisec } from "../../../libs/utils";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLine,
} from "victory";
import { compareDateMatch, getYMD } from "../../../libs/timetable-utils";
import { TableChartColLayout } from "./table-chart-col-layout";
import {
  IDailyPrescription,
  IDailyReport,
  IUserStatistics,
} from "../organisms/statistics";

interface IChartsProps {
  userStatistics: IUserStatistics[];
  prescriptions: IDailyPrescription[];
  dailyReports: IDailyReport[];
  startDate: Date;
  endDate: Date;
}

export const Charts = ({
  userStatistics,
  prescriptions,
  dailyReports,
  startDate,
  endDate,
}: IChartsProps) => {
  function getGraphEveryDayCounts(
    dailyReports: IDailyReport[],
    startDate: Date,
    endDate: Date
  ) {
    function getEveryDay(startDate: Date, endDate: Date) {
      console.log(startDate, endDate);
      let arr: number[] = [];
      const start = startDate.getTime();
      const end = endDate.getTime();
      const duration = end - start;
      const days = getHowManyDayFromMillisec(duration);
      arr.length = days;
      arr.fill(0);
      return arr.map((v, idx) => {
        const newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() + idx);
        return newDate;
      });
    }

    const everyDay = getEveryDay(startDate, endDate);
    const graphData = everyDay.map((day) => ({
      x: getYMD(day, "mmdd"),
      y: 0,
    }));

    dailyReports.forEach((day) => {
      const idx = everyDay.findIndex((everyDate) =>
        compareDateMatch(new Date(day.date), everyDate, "ymd")
      );
      if (idx) {
        graphData[idx].y = graphData[idx].y + day.reservationCount;
      }
    });
    return graphData;
  }
  function getGraphEachUserTotalCounts(
    userStatistics: IUserStatistics[]
  ): { x: string; y: number }[][] {
    return userStatistics.map((user) =>
      Object.entries(user.counts).map(([key, count]) => ({ x: key, y: count }))
    );
  }

  return (
    <>
      <div className="flex">
        <DashboardSectionLayout
          elementName="TABLE_CHART_PRESCRIPTION_COUNTS"
          padding
          children={
            <>
              <TableChartColLayout
                userStatistics={userStatistics}
                prescriptionInfo={prescriptions}
                renderIt={"prescriptions"}
                hasTotalInRow
                hasTotalInColumn
              />
            </>
          }
        />
        <DashboardSectionLayout
          elementName="TABLE_CHART_PRESCRIPTION_PRICE"
          padding
          children={
            <>
              <TableChartColLayout
                userStatistics={userStatistics}
                prescriptionInfo={prescriptions}
                renderIt={"prescriptions"}
                hasTotalInRow
                hasTotalInColumn
                showPrice
              />
            </>
          }
        />
      </div>

      <DashboardSectionLayout
        elementName="GRAPH_CHART_EVERYDAY_COUNTS"
        children={
          <div className="position-center-x relative max-w-4xl">
            <VictoryChart
              height={300}
              width={1000}
              domainPadding={[10, 0]}
              minDomain={{ y: 0 }}
              padding={{
                top: 60,
                bottom: 60,
                left: 70,
                right: 70,
              }}
            >
              <VictoryBar
                data={getGraphEveryDayCounts(dailyReports, startDate, endDate)}
                style={{
                  data: {
                    width: 10,
                  },
                }}
                labels={({ datum }) => datum.y}
              />
              {/* <VictoryLine
                          data={getGraphEveryDayCounts(
                            dailyReports,
                            startDate,
                            endDate
                          )}
                          style={{
                            data: {
                              strokeWidth: 2,
                            },
                          }}
                          labels={({ datum }) => datum.y}
                        /> */}
              <VictoryAxis
                dependentAxis
                style={{
                  tickLabels: {
                    fontSize: 14,
                  } as any,
                }}
                tickFormat={(tick) => `${tick}명`}
              />
              <VictoryAxis
                style={{
                  tickLabels: {
                    fontSize: 14,
                    angle: -35,
                  } as any,
                }}
                tickFormat={(tick) => {
                  return `${tick.substring(0, 2)}월 ${tick.substring(2, 4)}일`;
                }}
              />
            </VictoryChart>
          </div>
        }
      />

      <DashboardSectionLayout
        elementName="TABLE_CHART_EACH_USER_TOTAL_COUNTS"
        padding
        children={
          <>
            <TableChartColLayout
              userStatistics={userStatistics}
              prescriptionInfo={prescriptions}
              dailyReports={dailyReports}
              renderIt={"counts"}
              labelNames={["예약", "신규", "부도", "취소", "30일 경과"]}
              hasTotalInRow
            />
          </>
        }
      />
      <DashboardSectionLayout
        elementName="GRAPH_CHART_EACH_USER_TOTAL_COUNTS"
        children={
          <div className="position-center-x relative max-w-4xl">
            <VictoryChart height={300} width={1000} minDomain={{ y: 0 }}>
              <VictoryGroup offset={20} domainPadding={0} colorScale={"red"}>
                {getGraphEachUserTotalCounts(userStatistics).map((user) => (
                  <VictoryBar data={user} style={{ data: { width: 10 } }} />
                ))}
              </VictoryGroup>
            </VictoryChart>
          </div>
        }
      />
    </>
  );
};
