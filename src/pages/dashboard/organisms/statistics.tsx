import { DashboardSectionLayout } from "../components/section-layout";
import { useGetStatisticsLazyQuery } from "../../../graphql/generated/graphql";
import { getDateFromYMDHM } from "../../../libs/utils";
import { useForm } from "react-hook-form";
import { DashboardLi } from "../components/li";
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

type UserStatis = {
  name: string;
  prescriptions: {
    __typename?: "PrescriptionInfo" | undefined;
    id: number;
    name: string;
    requiredTime: number;
    price: number;
    count: number;
  }[];
};

type StastisticsResults = {
  __typename?: "StatisticsRsult";
  userName: string;
  statistics: Array<{
    __typename?: "DayCount";
    date: any;
    prescriptions: Array<{
      __typename?: "PrescriptionStatistics";
      name: string;
      count: number;
    }>;
  }>;
};
type PrescriptionStatis = {
  name: string;
  count: number;
  price: number;
};

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
    useState<PrescriptionStatis[]>();
  const [statisticsData, setStatisticsData] = useState<
    StastisticsResults[] | null
  >();

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

  function calcPrescNumOfTime(
    prescName: string,
    data: StastisticsResults | undefined | null
  ) {
    if (!data) return 0;
    return data.statistics.reduce((acc, cur) => {
      const prescription = cur.prescriptions.find((p) => p.name === prescName);
      if (prescription) {
        return acc + prescription.count;
      }
      return acc;
    }, 0);
  }

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
    if (data?.getStatistics.ok) {
      const { prescriptionInfo, results } = data.getStatistics;
      function makeFrame(): UserStatis[] {
        if (results && prescriptionInfo) {
          return results.map((result) => ({
            name: result.userName,
            prescriptions: prescriptionInfo.map((prescription) => ({
              ...prescription,
              count: 0,
            })),
          }));
        }
        throw new Error(
          "getStatisticsLzq > onCompleted > makeFrame > results || prescriptionInfo false"
        );
      }
      const users = makeFrame();

      function injectCount() {
        return users.map((user, i) => {
          const prescriptions = user.prescriptions.map((prescription) => ({
            ...prescription,
            count: calcPrescNumOfTime(
              prescription.name,
              data?.getStatistics.results![i]
            ),
          }));
          return { name: user.name, prescriptions };
        });
      }
      const newUserStatis = injectCount();

      function makePrescriptionStatistics() {
        if (prescriptionInfo) {
          const newPrescriptionsStatis: PrescriptionStatis[] =
            prescriptionInfo.map((info) => ({
              name: info.name,
              price: 0,
              count: 0,
            }));
          return newPrescriptionsStatis.map((prescription) => {
            const [price, count] = newUserStatis.reduce(
              (acc, cur) => {
                const findPrescription = cur.prescriptions.find(
                  (presc) => presc.name === prescription.name
                );
                if (findPrescription) {
                  return [
                    findPrescription.price * findPrescription.count + acc[0],
                    findPrescription.count + acc[1],
                  ];
                }
                throw new Error("findPrescription을 알 수 없습니다");
              },
              [0, 0]
            );
            return { ...prescription, price, count };
          });
        }
        console.warn(
          "makePrescriptionStatistics결과 prescriptionInfo가 없습니다"
        );
        return [];
      }
      const newPrescriptionsStatis = makePrescriptionStatistics();

      setStatisticsData(results);
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
              />
              ~
              <DatepickerWithInput
                formError={errors}
                setValue={setValue}
                defaultDate={defaultDate[1]}
                register={register}
                see="ymd"
                dateType={"endDate"}
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

      {statisticsData && userStatis && prescriptionsStatis && data ? (
        <>
          <DashboardSectionLayout
            padding
            children={
              <>
                <h3 className="first-:bg-red-500 text-center">
                  <div className="space-x-3 font-medium text-blue-700">
                    <span>{startDate.toLocaleDateString()}</span>
                    <span>~</span>
                    <span>{endDate.toLocaleDateString()}</span>
                  </div>
                </h3>

                <div className="flex px-4 pt-6">
                  <div className="flex flex-col px-2">
                    <h4 className="mb-4 text-center">목록</h4>
                    {data.getStatistics.prescriptionInfo?.map((info) => (
                      <div key={info.id} className="flex flex-col gap-1 py-1">
                        <span className="text-center">{info.name}</span>
                        <span className="text-right">
                          ￦{info.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  {userStatis.map((user, idx) => (
                    <div
                      key={idx}
                      className="flex w-full flex-col border-x px-2"
                    >
                      <h4 className="mb-4 text-center">{user.name}</h4>
                      {user.prescriptions.map((prescription, i) => (
                        <DashboardLi
                          key={i}
                          count={prescription.count}
                          sum={prescription.price * prescription.count}
                        />
                      ))}
                      <div className="mt-2 border-t border-black" />
                      <DashboardLi
                        sum={user.prescriptions.reduce(
                          (acc, cur) => acc + cur.price * cur.count,
                          0
                        )}
                        count={user.prescriptions.reduce(
                          (acc, cur) => acc + cur.count,
                          0
                        )}
                      />
                    </div>
                  ))}
                  {userStatis.length > 1 && (
                    <div className="flex w-full flex-col px-2">
                      <h4 className="mb-4 text-center">총합</h4>
                      {prescriptionsStatis.map((info, idx) => (
                        <DashboardLi
                          key={idx}
                          sum={info.price}
                          count={info.count}
                        />
                      ))}
                      <div className="mt-2 border-t border-black" />
                      <DashboardLi
                        sum={prescriptionsStatis.reduce(
                          (acc, cur) => acc + cur.price,
                          0
                        )}
                        count={prescriptionsStatis.reduce(
                          (acc, cur) => acc + cur.count,
                          0
                        )}
                      />
                    </div>
                  )}
                </div>
              </>
            }
          />

          <DashboardSectionLayout
            elementName="chart"
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
                        statisticsData.length !== 0
                          ? statisticsData
                              .map((result) =>
                                result.statistics?.map((data) => ({
                                  x: data.date,
                                  y: data.prescriptions.reduce(
                                    (prev, curr) => prev + curr.count,
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
