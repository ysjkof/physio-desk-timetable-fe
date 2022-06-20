import { DashboardSectionLayout } from "../components/section-layout";
import {
  GetStatisticsQuery,
  useGetStatisticsLazyQuery,
} from "../../../graphql/generated/graphql";
import {
  getDateFromYMDHM,
  getHowManyDayFromMillisec,
} from "../../../libs/utils";
import { useForm } from "react-hook-form";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLine,
  VictoryTheme,
} from "victory";
import { useEffect, useState } from "react";
import { DatepickerForm } from "../../../components/molecules/datepicker";
import { DatepickerWithInput } from "../../../components/molecules/datepicker-with-input";
import { InDashboardPageProps } from "..";
import { Button } from "../../../components/molecules/button";
import { selectedClinicVar } from "../../../store";
import { useReactiveVar } from "@apollo/client";
import {
  compareDateMatch,
  getAfterDate,
  getSunday,
  getYMD,
} from "../../../libs/timetable-utils";
import { BtnMenu } from "../../../components/molecules/button-menu";
import { TableChartColLayout } from "../molecules/table-chart-col-layout";
import { Worning } from "../../../components/atoms/warning";

type IDailyReports = GetStatisticsQuery["getStatistics"]["dailyReports"];
export type IDailyReport = NonNullable<FlatArray<IDailyReports, 0>>;

type IDailyPrescriptions = GetStatisticsQuery["getStatistics"]["prescriptions"];
export type IDailyPrescription = NonNullable<FlatArray<IDailyPrescriptions, 0>>;
interface IDailyPrescriptionWithCount extends IDailyPrescription {
  count: number;
}
export type IPrescriptionOfUser = IDailyReport["users"][0]["prescriptions"][0];

export type CountLists = {
  reservationCount: number;
  newPatient: number;
  noshow: number;
  cancel: number;
  visitMoreThanThirty: number;
};
export interface IUserStatistics {
  name: string;
  counts: CountLists;
  prescriptions: IDailyPrescriptionWithCount[];
}

interface IPrescriptionCounts {
  reservedCount: number;
  noshowCount: number;
  cancelCount: number;
  firstReservationCount: number;
}
interface IPrescriptionNamePrice {
  name: string;
  price: number;
}
interface IPrescription extends IPrescriptionNamePrice, IPrescriptionCounts {
  name: string;
  price: number;
}

export interface MemberState {
  userId: number;
  name: string;
  isSelected: boolean;
}
interface ModifiedDatepickerForm extends DatepickerForm {
  userIds?: number[];
}
type Durations =
  | "지난달"
  | "이번달"
  | "지난2주"
  | "지난주"
  | "이번주"
  | "그제"
  | "어제";
export const Statistics = ({ loggedInUser }: InDashboardPageProps) => {
  const selectedClinic = useReactiveVar(selectedClinicVar);

  let defaultDate: Date[] = [new Date(), new Date()];
  defaultDate[0].setDate(1);
  defaultDate[1].setMonth(defaultDate[0].getMonth() + 1, 0);

  const [memberState, setMemberState] = useState<MemberState[]>();
  const [prescriptionsStatis, setPrescriptionsStatis] =
    useState<IPrescription[]>();
  const [userStatistics, setUserStatistics] = useState<
    IUserStatistics[] | null
  >(null);

  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
  } = useForm<ModifiedDatepickerForm>({
    mode: "onChange",
  });

  const {
    startDateYear,
    startDateMonth,
    startDateDate,
    endDateYear,
    endDateMonth,
    endDateDate,
  } = getValues();

  const startDate = getDateFromYMDHM(
    startDateYear!,
    startDateMonth!,
    startDateDate!
  );
  const endDate = getDateFromYMDHM(endDateYear!, endDateMonth!, endDateDate!);

  endDate.setHours(24, 0, 0); // 입력 날짜의 00시를 LassThan하기 때문에 00시 00분 00초로 한다

  const userIds = memberState
    ? memberState
        .filter((member) => member.isSelected)
        .map((member) => member.userId)
    : [];

  const [getStatisticsLzq, { data, loading: loadingStatisticsData }] =
    useGetStatisticsLazyQuery({
      variables: {
        input: {
          startDate,
          endDate,
          clinicId: selectedClinic?.id ?? 0,
          userIds,
        },
      },
    });

  const onSubmit = () => {
    if (!loadingStatisticsData) getStatisticsLzq();
  };

  function onClickSetDate(duration: Durations) {
    let startDate = new Date();
    let endDate = new Date();
    const startMonth = startDate.getMonth();
    const sunday = getSunday(startDate);

    switch (duration) {
      case "지난달":
        startDate.setMonth(startMonth - 1, 1);
        endDate.setMonth(startMonth, 0);
        break;
      case "이번달":
        startDate.setMonth(startMonth, 1);
        endDate.setMonth(startMonth + 1, 0);
        break;
      case "지난2주":
        startDate = new Date(sunday.setDate(sunday.getDate() - 14));
        endDate = getAfterDate(sunday, 13);
        break;
      case "지난주":
        startDate = new Date(sunday.setDate(sunday.getDate() - 7));
        endDate = getAfterDate(sunday, 6);
        break;
      case "이번주":
        startDate = sunday;
        endDate = getAfterDate(sunday, 6);
        break;
      case "그제":
        startDate.setDate(startDate.getDate() - 2);
        endDate.setDate(endDate.getDate() - 2);
        break;
      case "어제":
        startDate.setDate(startDate.getDate() - 1);
        endDate.setDate(endDate.getDate() - 1);
        break;
    }
    setValue("startDateYear", startDate.getFullYear());
    setValue("startDateMonth", startDate.getMonth() + 1);
    setValue("startDateDate", startDate.getDate());
    setValue("endDateYear", endDate.getFullYear());
    setValue("endDateMonth", endDate.getMonth() + 1);
    setValue("endDateDate", endDate.getDate());
  }

  useEffect(() => {
    setMemberState(
      selectedClinic?.members?.map((m) => ({
        userId: m.user.id,
        name: m.user.name,
        isSelected: true,
      }))
    );
  }, [selectedClinic]);

  useEffect(() => {
    console.log("👀 dataa is : ", !!data);
    if (data?.getStatistics.dailyReports && data?.getStatistics.prescriptions) {
      const { dailyReports, prescriptions, visitRates } = data.getStatistics;

      console.log("dailyReports", dailyReports);
      console.log("prescriptions", prescriptions);
      console.log("visitRates", visitRates);
      console.log("memberState", memberState);

      function combineUserStatistics() {
        const flattening = (reports: IDailyReport[]) =>
          reports.map((day) => day.users).flat(1);
        const combineSameUser = (
          flatReports: ReturnType<typeof flattening>
        ) => {
          const obj: {
            [key: string]: {
              reservationCount: number;
              newPatient: number;
              noshow: number;
              cancel: number;
              visitMoreThanThirty: number;
              prescriptions: IDailyPrescriptionWithCount[];
            };
          } = {};

          flatReports.forEach((user) => {
            const userKey = user.userId;

            function makePrescriptionList(): IDailyPrescriptionWithCount[] {
              return prescriptions.map((prescription) => ({
                id: prescription.id,
                name: prescription.name,
                count: 0,
                price: 0,
                requiredTime: 0,
              }));
            }
            function combinePrescriptions(
              prevPrescriptions: IDailyPrescriptionWithCount[],
              nextPrescriptions: IPrescriptionOfUser[]
            ) {
              nextPrescriptions.forEach((prescription) => {
                const idx = prevPrescriptions.findIndex(
                  (prevPrescription) => prevPrescription.id === prescription.id
                );
                if (idx !== -1) {
                  prevPrescriptions[idx].count =
                    prevPrescriptions[idx].count + prescription.count;
                  prevPrescriptions[idx].price = 0;
                  prevPrescriptions[idx].requiredTime = 0;
                }
              });
              return prevPrescriptions;
            }

            const prevPrescriptions = obj[userKey]
              ? obj[userKey].prescriptions
              : makePrescriptionList();
            const nextPrescription = user.prescriptions;
            const injectedCount = combinePrescriptions(
              prevPrescriptions,
              nextPrescription
            );
            const injectedOther = injectedCount.map((prescription) => {
              const selectedPrescription = prescriptions.find(
                (prescriptionInList) =>
                  prescriptionInList.id === prescription.id
              );
              if (!selectedPrescription)
                throw new Error("처방을 찾을 수 없습니다");
              return {
                ...prescription,
                price: prescription.count * selectedPrescription.price,
                requiredTime:
                  prescription.count * selectedPrescription.requiredTime,
              };
            });

            if (obj[userKey]) {
              obj[userKey] = {
                reservationCount:
                  obj[userKey].reservationCount + user.reservationCount,
                newPatient: obj[userKey].newPatient + user.newPatient,
                noshow: obj[userKey].noshow + user.noshow,
                cancel: obj[userKey].cancel + user.cancel,
                visitMoreThanThirty:
                  obj[userKey].visitMoreThanThirty + user.visitMoreThanThirty,
                prescriptions: injectedOther,
              };
            } else {
              obj[userKey] = {
                reservationCount: user.reservationCount,
                newPatient: user.newPatient,
                noshow: user.noshow,
                cancel: user.cancel,
                visitMoreThanThirty: user.visitMoreThanThirty,
                prescriptions: injectedOther,
              };
            }
          });
          return obj;
        };
        const convertObjToArr = (
          objReport: ReturnType<typeof combineSameUser>
        ) => {
          const toArrReport = Object.entries(objReport);
          const injectUserName = toArrReport.map(([userId, reports]) => {
            function injectUserName() {
              const member = memberState?.find(
                (member) => member.userId === +userId
              );
              return member ? member.name : userId;
            }
            function divideReports() {
              const {
                reservationCount,
                newPatient,
                noshow,
                cancel,
                visitMoreThanThirty,
                prescriptions,
              } = reports;
              return {
                counts: {
                  reservationCount,
                  newPatient,
                  noshow,
                  cancel,
                  visitMoreThanThirty,
                },
                prescriptions,
              };
            }
            const { counts, prescriptions } = divideReports();
            return {
              name: injectUserName(),
              counts,
              prescriptions,
            };
          });
          return injectUserName;
        };
        const flatReports = flattening(dailyReports);
        const objReport = combineSameUser(flatReports);
        const arrReport = convertObjToArr(objReport);
        return arrReport;
      }
      const newUserStatistics = combineUserStatistics();
      console.log("newUserStatistics", newUserStatistics);
      setUserStatistics(newUserStatistics);
    }
  }, [data]);

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
      <DashboardSectionLayout
        elementName="date-picker"
        children={
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            {memberState && (
              <div className="flex w-full flex-wrap gap-4 px-2">
                {memberState.map((m, i) => (
                  <BtnMenu
                    key={m.userId}
                    label={m.name}
                    hasBorder
                    hasActiveRing
                    thinFont
                    enabled={m.isSelected}
                    onClick={() => {
                      memberState[i].isSelected = !memberState[i].isSelected;
                      setMemberState([...memberState]);
                    }}
                  />
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <BtnMenu
                hasBorder
                onClick={() => onClickSetDate("지난달")}
                label="지난달"
                enabled
                thinFont
              />
              <BtnMenu
                hasBorder
                onClick={() => onClickSetDate("이번달")}
                label="이번달"
                enabled
                thinFont
              />
              <BtnMenu
                hasBorder
                onClick={() => onClickSetDate("지난2주")}
                label="지난2주"
                enabled
                thinFont
              />
              <BtnMenu
                hasBorder
                onClick={() => onClickSetDate("지난주")}
                label="지난주"
                enabled
                thinFont
              />
              <BtnMenu
                hasBorder
                onClick={() => onClickSetDate("이번주")}
                label="이번주"
                enabled
                thinFont
              />
              <BtnMenu
                hasBorder
                onClick={() => onClickSetDate("그제")}
                label="그제"
                enabled
                thinFont
              />
              <BtnMenu
                hasBorder
                onClick={() => onClickSetDate("어제")}
                label="어제"
                enabled
                thinFont
              />
              <DatepickerWithInput
                setValue={setValue}
                defaultDate={defaultDate[0]}
                register={register}
                see="ymd"
                dateType={"startDate"}
                textColor="blue"
              />
              ~
              <DatepickerWithInput
                formError={errors}
                setValue={setValue}
                defaultDate={defaultDate[1]}
                register={register}
                see="ymd"
                dateType={"endDate"}
                textColor="blue"
              />
              <Button
                type="submit"
                isSmall
                textContents="검색"
                canClick={
                  isValid && !loadingStatisticsData && userIds.length > 0
                }
                loading={loadingStatisticsData}
              />
            </div>
          </form>
        }
      />
      {data &&
      data.getStatistics.prescriptions &&
      data.getStatistics.dailyReports &&
      userStatistics ? (
        <>
          {data.getStatistics.prescriptions.length < 1 && (
            <Worning type="hasNotPrescription" />
          )}
          {data.getStatistics.dailyReports.length < 1 && (
            <Worning type="hasNotStatistics" />
          )}
          {data.getStatistics.prescriptions.length > 1 &&
            data.getStatistics.dailyReports.length > 1 && (
              <>
                <div className="flex">
                  <DashboardSectionLayout
                    elementName="TABLE_CHART_PRESCRIPTION_COUNTS"
                    padding
                    children={
                      <>
                        <TableChartColLayout
                          userStatistics={userStatistics}
                          prescriptionInfo={data.getStatistics.prescriptions}
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
                          prescriptionInfo={data.getStatistics.prescriptions}
                          renderIt={"prescriptions"}
                          hasTotalInRow
                          hasTotalInColumn
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
                          data={getGraphEveryDayCounts(
                            data.getStatistics.dailyReports,
                            startDate,
                            endDate
                          )}
                          style={{
                            data: {
                              width: 10,
                            },
                          }}
                          labels={({ datum }) => datum.y}
                        />
                        {/* <VictoryLine
                          data={getGraphEveryDayCounts(
                            data.getStatistics.dailyReports,
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
                            return `${tick.substring(0, 2)}월 ${tick.substring(
                              2,
                              4
                            )}일`;
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
                        prescriptionInfo={data.getStatistics.prescriptions}
                        dailyReports={data.getStatistics.dailyReports!}
                        renderIt={"counts"}
                        labelNames={[
                          "예약",
                          "신규",
                          "부도",
                          "취소",
                          "30일 경과",
                        ]}
                        hasTotalInRow
                      />
                    </>
                  }
                />
                <DashboardSectionLayout
                  elementName="GRAPH_CHART_EACH_USER_TOTAL_COUNTS"
                  children={
                    <div className="position-center-x relative max-w-4xl">
                      <VictoryChart
                        height={300}
                        width={1000}
                        minDomain={{ y: 0 }}
                      >
                        <VictoryGroup
                          offset={20}
                          domainPadding={0}
                          colorScale={"red"}
                        >
                          {getGraphEachUserTotalCounts(userStatistics).map(
                            (user) => (
                              <VictoryBar
                                data={user}
                                style={{ data: { width: 10 } }}
                              />
                            )
                          )}
                        </VictoryGroup>
                      </VictoryChart>
                    </div>
                  }
                />
              </>
            )}
        </>
      ) : (
        <p className="position-center absolute text-base">
          검색조건을 설정한 다음 검색을 누르세요
        </p>
      )}
    </>
  );
};
