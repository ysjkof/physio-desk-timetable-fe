import { DashboardSectionLayout } from "../components/section-layout";
import {
  useFindPrescriptionsQuery,
  useGetStatisticsLazyQuery,
} from "../../../graphql/generated/graphql";
import { getDateFromYMDHM } from "../../../libs/utils";
import { useForm } from "react-hook-form";
import { DashboardLi } from "../components/li";
import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme } from "victory";
import { useEffect, useState } from "react";
import { DatepickerForm } from "../../../components/molecules/datepicker";
import { DatepickerWithInput } from "../../../components/molecules/datepicker-with-input";
import { InDashboardPageProps } from "..";
import { BtnMenu } from "../../../components/button-menu";
import { Button } from "../../../components/button";
import { selectedClinicVar } from "../../../store";
import { useReactiveVar } from "@apollo/client";

interface UserStatis {
  name: string;
  prescriptions: { [key: string]: number };
}

type StastisticsData = {
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

  const [memberState, setMemberState] = useState<MemberState[]>([]);
  const [userStatis, setUserStatis] = useState<UserStatis[]>([]);

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

  const { data: findPrescriptionsData, loading: loadingPrescriptionsData } =
    useFindPrescriptionsQuery({
      variables: {
        input: {
          includeInactivate: false,
          clinicId,
        },
      },
    });
  let userIds: number[] = [];
  memberState.forEach((member) => {
    if (member.isSelected === true) {
      userIds.push(member.id);
    }
  });

  const [
    getStatisticsLzq,
    { data: dataStatistics, loading: loadingStatisticsData },
  ] = useGetStatisticsLazyQuery();

  const onSubmit = () => {
    console.log("온서브밋", loadingStatisticsData);
    if (!loadingStatisticsData) {
      console.log("온서브밋 인");
      getStatisticsLzq({
        variables: {
          input: {
            startDate,
            endDate,
            ...(typeof clinicId === "number" &&
              clinicId !== 0 && {
                clinicId,
                userIds,
              }),
          },
        },
      });
    }
  };

  function calcTotalUsers(
    prescName: string,
    data: StastisticsData[] | undefined | null
  ) {
    if (!data) return 0;
    return data.reduce(
      (acc, cur) =>
        acc +
        cur.statistics.reduce((acc, cur) => {
          const exist = cur.prescriptions.find((p) => p.name === prescName);
          if (exist) {
            return acc + exist.count;
          }
          return acc;
        }, 0),
      0
    );
  }
  function calcPrescNumOfTime(
    prescName: string,
    data: StastisticsData | undefined | null
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
    setUserStatis([]);
  }, [clinicId]);

  useEffect(() => {
    if (!loadingStatisticsData && dataStatistics) {
      let users: UserStatis[] = dataStatistics?.getStatistics.results!.map(
        (v) => ({
          name: v.userName,
          prescriptions: {},
        })
      );
      if (clinicId === 0) {
      }
      findPrescriptionsData?.findPrescriptions.prescriptions?.forEach(
        (presc) => {
          users.forEach((user, idx) => {
            user.prescriptions[presc.name] = calcPrescNumOfTime(
              presc.name,
              dataStatistics?.getStatistics.results![idx]
            );
          });
        }
      );
      setUserStatis(users);
    }
  }, [dataStatistics]);

  return (
    <>
      <section className="date-picker">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DashboardSectionLayout
            children={
              <div className="space-y-2">
                {memberState.length >= 1 && (
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
                          memberState[i].isSelected =
                            !memberState[i].isSelected;
                          setMemberState([...memberState]);
                        }}
                      />
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <BtnMenu
                    hasBorder
                    onClick={() => {}}
                    label="지난달"
                    enabled
                    thinFont
                  />
                  <BtnMenu
                    hasBorder
                    onClick={() => {}}
                    label="이번달"
                    enabled
                    thinFont
                  />
                  <BtnMenu
                    hasBorder
                    onClick={() => {}}
                    label="2주전"
                    enabled
                    thinFont
                  />
                  <BtnMenu
                    hasBorder
                    onClick={() => {}}
                    label="지난주"
                    enabled
                    thinFont
                  />
                  <DatepickerWithInput
                    formError={errors}
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
                      !loadingPrescriptionsData &&
                      !loadingStatisticsData &&
                      (clinicId === 0 ? true : userIds.length > 0)
                    }
                    loading={loadingStatisticsData}
                  />
                  {/* <DashboardBtn
                    textContents="검색"
                    isValid={
                      isValid &&
                      !loadingPrescriptionsData &&
                      !loadingStatisticsData &&
                      (clinicId === 0 ? true : userIds.length > 0)
                    }
                    loading={loadingStatisticsData}
                  /> */}
                </div>
              </div>
            }
          />
        </form>
      </section>
      <section className="flex gap-4">
        <DashboardSectionLayout
          children={
            <>
              <h3 className="first-:bg-red-500 text-center">
                <div className="space-x-3 font-medium text-blue-700">
                  <span>{startDate.toLocaleDateString()}</span>
                  <span>~</span>
                  <span>{endDate.toLocaleDateString()}</span>
                </div>
              </h3>

              <div className="grid min-h-[16rem] grid-cols-2 gap-10 px-4 pt-6">
                {userStatis.map((user, idx) => (
                  <div key={idx} className="flex flex-col">
                    <h4 className="mb-4 text-center">{user.name}</h4>
                    {Object.entries(user.prescriptions).map((presc, i) => (
                      <DashboardLi
                        key={i}
                        name={presc[0]}
                        price={
                          findPrescriptionsData?.findPrescriptions.prescriptions?.find(
                            (v) => v.name === presc[0]
                          )?.price! * presc[1] ?? 0
                        }
                        count={presc[1]}
                      />
                    ))}
                    <div className="mt-6 border-t" />
                    <DashboardLi
                      price={Object.entries(user.prescriptions).reduce(
                        (acc, cur) =>
                          acc +
                          findPrescriptionsData?.findPrescriptions.prescriptions?.find(
                            (presc) => presc.name === cur[0]
                          )?.price! *
                            cur[1],
                        0
                      )}
                      count={Object.values(user.prescriptions).reduce(
                        (acc, cur) => acc + cur,
                        0
                      )}
                    />
                    <div></div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-[1fr_7.5rem_3.3rem] justify-between gap-3 border-t border-black">
                <span className="">총합</span>
                <span className="text-center">
                  {userStatis
                    .map((user) =>
                      Object.entries(user.prescriptions).reduce(
                        (acc, cur) =>
                          acc +
                          findPrescriptionsData?.findPrescriptions.prescriptions?.find(
                            (presc) => presc.name === cur[0]
                          )?.price! *
                            cur[1],
                        0
                      )
                    )
                    .reduce((acc, cur) => acc + cur, 0)
                    .toLocaleString()}
                  원
                </span>
                <span className="text-center">
                  {userStatis
                    .map((user) =>
                      Object.values(user.prescriptions).reduce(
                        (acc, cur) => acc + cur,
                        0
                      )
                    )
                    .reduce((acc, cur) => acc + cur, 0)}
                  번
                </span>
              </div>
            </>
          }
        />
      </section>
      <section className="chart">
        <DashboardSectionLayout
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
                      dataStatistics?.getStatistics.results?.length !== 0
                        ? dataStatistics?.getStatistics.results
                            ?.map((result) =>
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
                                const idx = prev!.findIndex((p) => p.x === c.x);
                                if (idx === -1) {
                                  prev?.push(c);
                                } else {
                                  prev![idx].y = c.y + prev![idx].y;
                                }
                              });
                              return prev;
                            })
                        : []
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
                        fontSize: 20,
                      } as any,
                    }}
                    tickFormat={(tick) => `${tick}명`}
                  />
                  <VictoryAxis
                    style={{
                      tickLabels: {
                        fontSize: 20,
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
      </section>
    </>
  );
};
