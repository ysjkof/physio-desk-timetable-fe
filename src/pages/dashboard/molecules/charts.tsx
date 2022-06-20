import { DashboardSectionLayout } from "../components/section-layout";
import { getHowManyDayFromMillisec } from "../../../libs/utils";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLabel,
  VictoryLegend,
  VictoryLine,
  VictoryPie,
} from "victory";
import { compareDateMatch, getYMD } from "../../../libs/timetable-utils";
import { TableChartColLayout } from "./table-chart-col-layout";
import {
  IDailyPrescription,
  IDailyReport,
  IUserStatistics,
} from "../organisms/statistics";

type TypePrescriptionName =
  | "reservationCount"
  | "newPatient"
  | "noshow"
  | "cancel"
  | "visitMoreThanThirty";

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
  const COUNTS_LABELS = ["예약", "신규", "부도", "취소", "30일 경과"];
  const LABLES_COLORS = ["#233d4d", "#fe7f2d", "#fcca46", "#a1c181", "#619b8a"];

  function getCountsLabelsToKor(prescriptionName: TypePrescriptionName) {
    switch (prescriptionName) {
      case "reservationCount":
        return "예약";
      case "newPatient":
        return "신규";
      case "noshow":
        return "부도";
      case "cancel":
        return "취소";
      case "visitMoreThanThirty":
        return "30일 경과";
    }
  }

  function injectEveryDayToDailyRreports(
    dailyReports: IDailyReport[],
    startDate: Date,
    endDate: Date
  ) {
    function getEveryDay(startDate: Date, endDate: Date) {
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
      y: {
        reservationCount: 0,
        noshow: 0,
        cancel: 0,
        newPatient: 0,
        users: [],
      },
    }));

    dailyReports.forEach((day) => {
      const idx = everyDay.findIndex((everyDate) =>
        compareDateMatch(new Date(day.date), everyDate, "ymd")
      );
      if (idx) {
        // @ts-ignore
        graphData[idx].y = { ...day };
      } else {
        graphData[idx].y = { ...graphData[idx].y };
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

  const finalDailyReports = injectEveryDayToDailyRreports(
    dailyReports,
    startDate,
    endDate
  );

  const graphEachUserTotalCounts = getGraphEachUserTotalCounts(userStatistics);

  return (
    <>
      <div className="PRESCRIPTION_COUNTS flex">
        <DashboardSectionLayout
          elementName="TABLE_PRESCRIPTION_COUNTS"
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
          elementName="TABLE_PRESCRIPTION_PRICE"
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

      <div className="EVERYDAY_COUNTS">
        <DashboardSectionLayout
          elementName="GRAPH_EVERYDAY_RESERVATION"
          children={
            <div className="position-center-x relative max-w-4xl">
              <VictoryChart height={300} width={1000} minDomain={{ y: 0 }}>
                <VictoryLegend
                  x={500}
                  title="일별 예약"
                  centerTitle
                  style={{ title: { fontSize: 16 } }}
                  data={[]}
                />
                <VictoryBar
                  data={finalDailyReports.map((data) => ({
                    x: data.x,
                    y: data.y.reservationCount,
                  }))}
                  style={{
                    data: {
                      width: 10,
                      fill: "rgb(0,0,0,0.7)",
                    },
                  }}
                  labels={({ datum }) => (datum.y === 0 ? "" : datum.y)}
                />
                {/* <VictoryLine
                  data={finalDailyReports.map((data) => ({
                    x: data.x,
                    y: data.y.reservationCount,
                  }))}
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
                    },
                  }}
                  tickFormat={(tick) => (tick % 1 === 0 ? `${tick}명` : "")}
                />
                <VictoryAxis
                  style={{
                    tickLabels: {
                      fontSize: 14,
                      angle: -35,
                    },
                    axisLabel: { padding: 35 },
                  }}
                  tickFormat={(tick) => {
                    return `${tick.substring(0, 2)} / ${tick.substring(2, 4)}`;
                  }}
                  label="(월/일)"
                />
              </VictoryChart>
            </div>
          }
        />
        <DashboardSectionLayout
          elementName="GRAPH_EVERYDAY_NEW_PATIENT"
          children={
            <div className="position-center-x relative max-w-4xl">
              <VictoryChart height={300} width={1000} minDomain={{ y: 0 }}>
                <VictoryLegend
                  x={500}
                  title="일별 신환"
                  centerTitle
                  style={{ title: { fontSize: 16 } }}
                  data={[]}
                />
                <VictoryBar
                  data={finalDailyReports.map((data) => ({
                    x: data.x,
                    y: data.y.newPatient,
                  }))}
                  style={{
                    data: {
                      width: 10,
                      fill: "rgb(0,0,0,0.7)",
                    },
                  }}
                  labels={({ datum }) => (datum.y === 0 ? "" : datum.y)}
                />
                <VictoryAxis
                  dependentAxis
                  style={{
                    tickLabels: {
                      fontSize: 14,
                    },
                  }}
                  tickFormat={(tick) => (tick % 1 === 0 ? `${tick}명` : "")}
                />
                <VictoryAxis
                  style={{
                    tickLabels: {
                      fontSize: 14,
                      angle: -35,
                    },
                    axisLabel: { padding: 35 },
                  }}
                  tickFormat={(tick) => {
                    return `${tick.substring(0, 2)} / ${tick.substring(2, 4)}`;
                  }}
                  label="(월/일)"
                />
              </VictoryChart>
            </div>
          }
        />
        <DashboardSectionLayout
          elementName="GRAPH_EVERYDAY_NOSHOW"
          children={
            <div className="position-center-x relative max-w-4xl">
              <VictoryChart height={300} width={1000} minDomain={{ y: 0 }}>
                <VictoryLegend
                  x={500}
                  title="일별 부도"
                  centerTitle
                  style={{ title: { fontSize: 16 } }}
                  data={[]}
                />
                <VictoryBar
                  data={finalDailyReports.map((data) => ({
                    x: data.x,
                    y: data.y.noshow,
                  }))}
                  style={{
                    data: {
                      width: 10,
                      fill: "rgb(0,0,0,0.7)",
                    },
                  }}
                  labels={({ datum }) => (datum.y === 0 ? "" : datum.y)}
                />
                <VictoryAxis
                  dependentAxis
                  style={{
                    tickLabels: {
                      fontSize: 14,
                    },
                  }}
                  tickFormat={(tick) => (tick % 1 === 0 ? `${tick}명` : "")}
                />
                <VictoryAxis
                  style={{
                    tickLabels: {
                      fontSize: 14,
                      angle: -35,
                    },
                    axisLabel: { padding: 35 },
                  }}
                  tickFormat={(tick) => {
                    return `${tick.substring(0, 2)} / ${tick.substring(2, 4)}`;
                  }}
                  label="(월/일)"
                />
              </VictoryChart>
            </div>
          }
        />
        <DashboardSectionLayout
          elementName="GRAPH_EVERYDAY_CANCEL"
          children={
            <div className="position-center-x relative max-w-4xl">
              <VictoryChart height={300} width={1000} minDomain={{ y: 0 }}>
                <VictoryLegend
                  x={500}
                  title="일별 취소"
                  centerTitle
                  style={{ title: { fontSize: 16 } }}
                  data={[]}
                />
                <VictoryBar
                  data={finalDailyReports.map((data) => ({
                    x: data.x,
                    y: data.y.cancel,
                  }))}
                  style={{
                    data: {
                      width: 10,
                      fill: "rgb(0,0,0,0.7)",
                    },
                  }}
                  labels={({ datum }) => (datum.y === 0 ? "" : datum.y)}
                />
                <VictoryAxis
                  dependentAxis
                  style={{
                    tickLabels: {
                      fontSize: 14,
                    },
                  }}
                  tickFormat={(tick) => (tick % 1 === 0 ? `${tick}명` : "")}
                />
                <VictoryAxis
                  style={{
                    tickLabels: {
                      fontSize: 14,
                      angle: -35,
                    },
                    axisLabel: { padding: 35 },
                  }}
                  tickFormat={(tick) => {
                    return `${tick.substring(0, 2)} / ${tick.substring(2, 4)}`;
                  }}
                  label="(월/일)"
                />
              </VictoryChart>
            </div>
          }
        />
        <DashboardSectionLayout
          elementName="GRAPH_EVERYDAY_thirty"
          children={
            <div className="position-center-x relative max-w-4xl">
              <VictoryChart height={300} width={1000} minDomain={{ y: 0 }}>
                <VictoryLegend
                  x={500}
                  title="일별 30일 경과"
                  centerTitle
                  style={{ title: { fontSize: 16 } }}
                  data={[]}
                />
                <VictoryBar
                  data={finalDailyReports.map((data) => ({
                    x: data.x,
                    y: data.y.users.reduce(
                      (acc, user) => acc + user.visitMoreThanThirty,
                      0
                    ),
                  }))}
                  style={{
                    data: {
                      width: 10,
                      fill: "rgb(0,0,0,0.7)",
                    },
                  }}
                  labels={({ datum }) => (datum.y === 0 ? "" : datum.y)}
                />
                <VictoryAxis
                  dependentAxis
                  style={{
                    tickLabels: {
                      fontSize: 14,
                    },
                  }}
                  tickFormat={(tick) => (tick % 1 === 0 ? `${tick}명` : "")}
                />
                <VictoryAxis
                  style={{
                    tickLabels: {
                      fontSize: 14,
                      angle: -35,
                    },
                    axisLabel: { padding: 35 },
                  }}
                  tickFormat={(tick) => {
                    return `${tick.substring(0, 2)} / ${tick.substring(2, 4)}`;
                  }}
                  label="(월/일)"
                />
              </VictoryChart>
            </div>
          }
        />
      </div>

      <div className="EACH_USER_TOTAL_COUNTS">
        <DashboardSectionLayout
          elementName="TABLE_EACH_USER_TOTAL_COUNTS"
          // padding
          children={
            <>
              <TableChartColLayout
                userStatistics={userStatistics}
                prescriptionInfo={prescriptions}
                dailyReports={dailyReports}
                renderIt={"counts"}
                labelNames={COUNTS_LABELS}
                hasTotalInRow
              />
            </>
          }
        />

        <DashboardSectionLayout
          elementName="GRAPH_EACH_USER_TOTAL_COUNTS"
          // padding
          children={
            <div className="position-center-x relative max-w-4xl">
              <VictoryChart height={300} width={1000} minDomain={{ y: 0 }}>
                <VictoryLegend
                  x={500}
                  title="사용자별 통계"
                  centerTitle
                  style={{ title: { fontSize: 16 } }}
                  data={[]}
                />
                <VictoryGroup offset={20} domainPadding={0} colorScale={"red"}>
                  {graphEachUserTotalCounts.map((user, i) => (
                    <VictoryBar
                      key={i}
                      data={user}
                      style={{ data: { width: 10 } }}
                      labels={({ datum }) => (datum.y === 0 ? "" : datum.y)}
                    />
                  ))}
                </VictoryGroup>

                <VictoryAxis
                  dependentAxis
                  style={{
                    tickLabels: {
                      fontSize: 14,
                    },
                  }}
                  tickFormat={(tick) => (tick % 1 === 0 ? `${tick}명` : "")}
                />
                <VictoryAxis
                  style={{
                    tickLabels: {
                      fontSize: 14,
                      fill: LABLES_COLORS[4],
                    },
                  }}
                  tickFormat={(tick) => getCountsLabelsToKor(tick)}
                />
              </VictoryChart>
            </div>
          }
        />
        <DashboardSectionLayout
          elementName="GRAPH_EACH_USER_TOTAL_COUNTS_CIRCLES"
          children={
            <div className="position-center-x relative max-w-4xl ">
              <VictoryLegend
                height={24}
                orientation="horizontal"
                gutter={30}
                data={COUNTS_LABELS.map((label, idx) => ({
                  name: label,
                }))}
                labelComponent={<VictoryLabel style={{ fontSize: 10 }} />}
                colorScale={LABLES_COLORS}
              />
              <div className="grid grid-cols-2">
                {graphEachUserTotalCounts.map((user, i) => (
                  <VictoryPie
                    key={i}
                    data={user}
                    padding={70}
                    // innerRadius={50}
                    style={{ labels: { fontSize: 16 } }}
                    labels={({ datum }) =>
                      datum.y === 0
                        ? ""
                        : `${getCountsLabelsToKor(datum.x)} : ${datum.y}`
                    }
                    padAngle={({ datum }) => datum.y}
                    innerRadius={5}
                    colorScale={LABLES_COLORS}
                  />
                ))}
              </div>
            </div>
          }
        />
      </div>
    </>
  );
};
