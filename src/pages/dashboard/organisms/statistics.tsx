import { DashboardSectionLayout } from "../components/section-layout";
import {
  ReservationState,
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

interface IDataResult {
  __typename?: "StatisticsRsult";
  userName: string;
  statistics: Array<{
    __typename?: "DayCount";
    date: any;
    firstReservations: Array<{
      __typename?: "Reservation";
      id: number;
      isFirst: boolean;
      startDate: any;
      endDate: any;
      state: ReservationState;
      memo?: string | null;
      user: { __typename?: "User"; id: number; name: string };
      patient: {
        __typename?: "Patient";
        id: number;
        name: string;
        gender: string;
        registrationNumber?: string | null;
        birthday?: any | null;
        memo?: string | null;
      };
    }>;
    prescriptions: Array<{
      __typename?: "PrescriptionStatistics";
      name: string;
      reservedCount: number;
      noshowCount: number;
      cancelCount: number;
    }>;
  }>;
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
interface UserStatis {
  name: string;
  prescriptions: Prescriptions[];
}

export interface MemberState {
  id: number;
  name: string;
  isSelected: boolean;
}
interface ModifiedDatepickerForm extends DatepickerForm {
  userIds?: number[];
}

export const Statistics = ({ loggedInUser }: InDashboardPageProps) => {
  const { id: clinicId, members } = useReactiveVar(selectedClinicVar);

  let defaultDate: Date[] = [new Date(), new Date()];
  defaultDate[0].setDate(1);
  defaultDate[1].setMonth(defaultDate[0].getMonth() + 1, 0);

  const [memberState, setMemberState] = useState<MemberState[]>();
  const [userStatis, setUserStatis] = useState<UserStatis[]>();
  const [prescriptionsStatis, setPrescriptionsStatis] =
    useState<IPrescription[]>();
  const [_, setStatisticsData] = useState<typeof data>();

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

  endDate.setHours(23, 59, 59); // 입력 날짜의 오전 00시를 구하기 때문에 날짜 +1해줘야 바르게 검색된다.

  const userIds = memberState
    ? memberState
        .filter((member) => member.isSelected)
        .map((member) => member.id)
    : [];

  const [getStatisticsLzq, { data, loading: loadingStatisticsData }] =
    useGetStatisticsLazyQuery({
      variables: {
        input: {
          startDate,
          endDate,
          ...(typeof clinicId === "number" &&
            clinicId !== 0 &&
            userIds.length !== 0 && {
              clinicId,
              userIds,
            }),
        },
      },
    });

  const onSubmit = () => {
    if (!loadingStatisticsData) getStatisticsLzq();
  };

  function onClickSetDate(
    duration: "지난달" | "이번달" | "지난2주" | "지난주" | "그제" | "어제"
  ) {
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
    if (clinicId !== 0 && members) {
      setMemberState(
        members.map((m) => ({
          id: m.user.id,
          name: m.user.name,
          isSelected: true,
        }))
      );
    } else {
      setMemberState([]);
    }
    setUserStatis(undefined);
    setStatisticsData(undefined);
  }, [clinicId]);

  useEffect(() => {
    const defaultCountsObj = {
      reservedCount: 0,
      noshowCount: 0,
      cancelCount: 0,
      firstReservationCount: 0,
    };
    function getPrescriptionTotalCount(
      prescName: string,
      data: IDataResult | undefined | null
    ) {
      if (!data) return defaultCountsObj;
      return data.statistics.reduce((acc, cur) => {
        const prescription = cur.prescriptions.find(
          (p) => p.name === prescName
        );
        if (prescription) {
          return {
            reservedCount: acc.reservedCount + prescription.reservedCount,
            noshowCount: acc.noshowCount + prescription.noshowCount,
            cancelCount: acc.cancelCount + prescription.cancelCount,
            firstReservationCount:
              acc.firstReservationCount + cur.firstReservations.length,
          };
        }
        return acc;
      }, defaultCountsObj);
    }

    if (data?.getStatistics.ok) {
      const { prescriptionInfo, results } = data.getStatistics;
      function makeUserStatisFrame(): UserStatis[] {
        if (results && prescriptionInfo) {
          if (!memberState)
            throw new Error(
              "getStatisticsLzq > onCompleted > makeFrame > memberState is undefined"
            );
          const filterMember = memberState.filter(
            (member) => member.isSelected
          );
          const userFrame = filterMember.map((member) => ({
            name: member.name,
          }));
          const prescriptions = prescriptionInfo.map((prescription) => ({
            ...prescription,
            reservedCount: 0,
            cancelCount: 0,
            noshowCount: 0,
            firstReservationCount: 0,
          }));
          return userFrame.map((user) => {
            const existUser = results.find(
              (member) => member.userName === user.name
            );
            if (existUser) {
              return {
                name: existUser.userName,
                prescriptions: [...prescriptions],
              };
            }
            return {
              name: user.name,
              prescriptions: [...prescriptions],
            };
          });
        }
        throw new Error(
          "getStatisticsLzq > onCompleted > makeFrame > results || prescriptionInfo false"
        );
      }
      const userStatisFrame = makeUserStatisFrame();

      function injectCount() {
        return userStatisFrame.map((user, i) => {
          const prescriptions = user.prescriptions.map((prescription) => {
            const prescriptionTotalCount = getPrescriptionTotalCount(
              prescription.name,
              data?.getStatistics.results![i]
            );
            return {
              ...prescription,
              reservedCount: prescriptionTotalCount.reservedCount,
              noshowCount: prescriptionTotalCount.noshowCount,
              cancelCount: prescriptionTotalCount.cancelCount,
              firstReservationCount:
                prescriptionTotalCount.firstReservationCount,
            };
          });
          return { name: user.name, prescriptions };
        });
      }
      const newUserStatis = injectCount();

      function makePrescriptionStatistics() {
        if (prescriptionInfo) {
          const newPrescriptionsStatis: IPrescription[] = prescriptionInfo.map(
            (info) => ({
              name: info.name,
              reservedCount: 0,
              cancelCount: 0,
              noshowCount: 0,
              price: info.price,
              firstReservationCount: 0,
            })
          );
          return newPrescriptionsStatis.map((prescription) => {
            const {
              price,
              reservedCount,
              cancelCount,
              noshowCount,
              firstReservationCount,
            } = newUserStatis.reduce(
              (acc, cur) => {
                const findPrescription = cur.prescriptions.find(
                  (presc) => presc.name === prescription.name
                );
                if (findPrescription) {
                  return {
                    price:
                      findPrescription.price *
                      (findPrescription.reservedCount + acc.reservedCount),
                    reservedCount:
                      findPrescription.reservedCount + acc.reservedCount,
                    cancelCount: findPrescription.cancelCount + acc.cancelCount,
                    noshowCount: findPrescription.noshowCount + acc.noshowCount,
                    firstReservationCount:
                      findPrescription.firstReservationCount +
                      acc.firstReservationCount,
                  };
                }
                throw new Error("findPrescription을 알 수 없습니다");
              },
              { ...defaultCountsObj, price: 0 }
            );
            return {
              ...prescription,
              price,
              reservedCount,
              cancelCount,
              noshowCount,
              firstReservationCount,
            };
          });
        }
        console.warn(
          "makePrescriptionStatistics결과 prescriptionInfo가 없습니다"
        );
        return [];
      }
      const newPrescriptionsStatis = makePrescriptionStatistics();
      setStatisticsData(data); // 페이지 바뀔때 화면 초기화 위해서 필요함
      setUserStatis(newUserStatis);
      setPrescriptionsStatis(newPrescriptionsStatis);
    }
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
                    key={m.id}
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
                  isValid &&
                  !loadingStatisticsData &&
                  (clinicId === 0 ? true : userIds.length > 0)
                }
                loading={loadingStatisticsData}
              />
            </div>
          </form>
        }
      />
      {userStatis && prescriptionsStatis && data ? (
        <>
          <div className="flex">
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
          </div>
          <DashboardSectionLayout
            elementName="TABLE_CHART_COUNTS"
            padding
            children={
              <>
                <TableChartColLayout
                  labelNames={["예약", "신규", "부도", "취소"]}
                  individualData={userStatis.map((user) => ({
                    name: user.name,
                    counts: user.prescriptions.reduce(
                      (acc, cur) => [
                        acc[0] + cur.reservedCount,
                        acc[0] + cur.firstReservationCount,
                        acc[0] + cur.noshowCount,
                        acc[0] + cur.cancelCount,
                      ],
                      [0, 0, 0, 0]
                    ),
                  }))}
                  counts={[
                    prescriptionsStatis?.reduce(
                      (acc, cur) => acc + cur.reservedCount,
                      0
                    )!,
                    prescriptionsStatis?.reduce(
                      (acc, cur) => acc + cur.firstReservationCount,
                      0
                    )!,
                    prescriptionsStatis?.reduce(
                      (acc, cur) => acc + cur.noshowCount,
                      0
                    )!,
                    prescriptionsStatis?.reduce(
                      (acc, cur) => acc + cur.cancelCount,
                      0
                    )!,
                  ]}
                />
              </>
            }
          />

          <DashboardSectionLayout
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
          />
        </>
      ) : (
        <p className="position-center absolute text-base">
          검색조건을 설정한 다음 검색을 누르세요
        </p>
      )}
    </>
  );
};
