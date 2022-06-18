import { DashboardSectionLayout } from "../components/section-layout";
import {
  GetStatisticsQuery,
  useGetStatisticsLazyQuery,
} from "../../../graphql/generated/graphql";
import { getDateFromYMDHM } from "../../../libs/utils";
import { useForm } from "react-hook-form";
import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme } from "victory";
import { useEffect, useState } from "react";
import { DatepickerForm } from "../../../components/molecules/datepicker";
import { DatepickerWithInput } from "../../../components/molecules/datepicker-with-input";
import { InDashboardPageProps } from "..";
import { Button } from "../../../components/molecules/button";
import { selectedClinicVar } from "../../../store";
import { useReactiveVar } from "@apollo/client";
import { getAfterDate, getSunday } from "../../../libs/timetable-utils";
import { BtnMenu } from "../../../components/molecules/button-menu";
import { TableChartColLayout } from "../molecules/table-chart-col-layout";

type IDailyReports = GetStatisticsQuery["getStatistics"]["dailyReports"];
type IDailyReport = NonNullable<FlatArray<IDailyReports, 0>>;
export type CountLists = {
  reservationCount: number;
  newPatient: number;
  noshow: number;
  cancel: number;
  visitMoreThanThirty: number;
};
interface IUserStatistics {
  userName: string;
  counts: CountLists;
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
interface Prescriptions extends IPrescription {
  __typename?: "PrescriptionInfo" | undefined;
  id: number;
  requiredTime: number;
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
  const [userStatistics, setUserStatistics] = useState<IUserStatistics[]>([]);

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
            };
          } = {};
          flatReports.forEach((user) => {
            const userKey = user.userId;
            if (obj[userKey]) {
              obj[userKey] = {
                reservationCount:
                  obj[userKey].reservationCount + user.reservationCount,
                newPatient: obj[userKey].newPatient + user.newPatient,
                noshow: obj[userKey].noshow + user.noshow,
                cancel: obj[userKey].cancel + user.cancel,
                visitMoreThanThirty:
                  obj[userKey].visitMoreThanThirty + user.visitMoreThanThirty,
              };
            } else {
              obj[userKey] = {
                reservationCount: user.reservationCount,
                newPatient: user.newPatient,
                noshow: user.noshow,
                cancel: user.cancel,
                visitMoreThanThirty: user.visitMoreThanThirty,
              };
            }
          });
          return obj;
        };
        const convertObjToArr = (
          objReport: ReturnType<typeof combineSameUser>
        ) => {
          const toArrReport = Object.entries(objReport);
          return toArrReport.map(([userId, reports]) => {
            function injectUserName() {
              const member = memberState?.find(
                (member) => member.userId === +userId
              );
              return member ? member.name : userId;
            }

            return {
              userName: injectUserName(),
              counts: reports,
            };
          });
        };
        const flatReports = flattening(dailyReports);
        const objReport = combineSameUser(flatReports);
        console.log("objReport", objReport);
        const arrReport = convertObjToArr(objReport);
        setUserStatistics(arrReport);
      }
      combineUserStatistics();
    }
    console.log("userStatistics", userStatistics);
  }, [data]);

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
      {data ? (
        <>
          {/* <div className="flex">
            <DashboardSectionLayout
              elementName="TABLE_CHART_PRESCRIPTION_COUNT"
              padding
              children={
                <>
                  <TableChartColLayout
                    labelNames={data.getStatistics.prescriptionInfo!.map(
                      (info) => info.name
                    )}
                    hasLabelTotal
                    individualData={userStatis.map((user) => ({
                      name: user.name,
                      counts: user.prescriptions.map(
                        (prescription) => prescription.reservedCount ?? 0
                      ),
                      countTotal: user.prescriptions.reduce(
                        (acc, cur) => acc + cur.reservedCount,
                        0
                      ),
                    }))}
                    counts={prescriptionsStatis.map(
                      (info, idx) => info.reservedCount
                    )}
                    countTotal={prescriptionsStatis.reduce(
                      (acc, cur) => acc + cur.reservedCount,
                      0
                    )}
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
                    labelNames={data.getStatistics.prescriptionInfo!.map(
                      (info) => info.name
                    )}
                    hasLabelTotal
                    individualData={userStatis.map((user) => ({
                      name: user.name,
                      counts: user.prescriptions.map(
                        (prescription) =>
                          prescription.price * prescription.reservedCount
                      ),
                      countTotal: user.prescriptions.reduce(
                        (acc, cur) => acc + cur.price * cur.reservedCount,
                        0
                      ),
                    }))}
                    counts={prescriptionsStatis.map((info, idx) => info.price)}
                    countTotal={prescriptionsStatis.reduce(
                      (acc, cur) => acc + cur.price,
                      0
                    )}
                  />
                </>
              }
            />
          </div> */}
          <DashboardSectionLayout
            elementName="TABLE_CHART_USER_COUNTS"
            padding
            children={
              <>
                <TableChartColLayout
                  labelNames={["예약", "신규", "부도", "취소", "30일 경과"]}
                  individualData={userStatistics}
                  counts={data.getStatistics.dailyReports!.reduce(
                    (acc, cur) => [
                      acc[0] + cur.reservationCount,
                      acc[1] + cur.newPatient,
                      acc[2] + cur.noshow,
                      acc[3] + cur.cancel,
                      acc[4] +
                        cur.users.reduce(
                          (acc, cur) => acc + cur.visitMoreThanThirty,
                          0
                        ),
                    ],
                    [0, 0, 0, 0, 0]
                  )}
                />
              </>
            }
          />

          {/* <DashboardSectionLayout
            elementName="graph_chart"
            children={
              <>
                <div className="relative">
                  <VictoryChart
                    height={500}
                    width={window.innerWidth}
                    domainPadding={50}
                    theme={VictoryTheme.material}
                    minDomain={{ y: 0 }}
                    padding={{
                      top: 60,
                      bottom: 60,
                      left: 70,
                      right: 70,
                    }}
                  >
                    <VictoryLine
                      data={
                        data.getStatistics.results?.length !== 0
                          ? data.getStatistics.results
                              ?.map((result) =>
                                result.statistics?.map((data) => ({
                                  x: data.date,
                                  y: data.prescriptions.reduce(
                                    (prev, curr) => prev + curr.reservedCount,
                                    0
                                  ),
                                }))
                              )
                              .reduce((prev, curr) => {
                                curr?.forEach((c) => {
                                  const idx = prev!.findIndex(
                                    (p) => p.x === c.x
                                  );
                                  if (idx === -1) {
                                    prev?.push(c);
                                  } else {
                                    prev![idx].y = c.y + prev![idx].y;
                                  }
                                });
                                return prev;
                              })
                          : undefined
                      }
                      style={{
                        data: {
                          strokeWidth: 5,
                        },
                      }}
                      labels={({ datum }) => datum.y}
                    />

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
                        } as any,
                      }}
                      tickFormat={(tick) =>
                        new Date(tick).toLocaleDateString("ko", {
                          day: "2-digit",
                        })
                      }
                    />
                  </VictoryChart>
                </div>
              </>
            }
          /> */}
        </>
      ) : (
        <p className="position-center absolute text-base">
          검색조건을 설정한 다음 검색을 누르세요
        </p>
      )}
    </>
  );
};
