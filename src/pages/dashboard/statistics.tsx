import { DashboardTitle } from "./components/title";
import { DashboardSectionLayout } from "./components/section-layout";
import {
  useFindPrescriptionsQuery,
  useGetStatisticsLazyQuery,
} from "../../graphql/generated/graphql";
import { cls, getDateFromYMDHM } from "../../libs/utils";
import { DatepickerForm } from "../../components/datepicker";
import { useForm } from "react-hook-form";
import { DatepickerWithInput } from "../../components/datepicker-with-input";
import { DashboardLi } from "./components/li";
import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme } from "victory";
import { InDashboardPageProps } from ".";
import { useEffect, useState } from "react";
import { DashboardBtn } from "./components/button";

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

export const Statistics = ({
  id,
  name,
  isStayed,
  members,
  loggedInUser,
}: InDashboardPageProps) => {
  if (!isStayed) {
    return <h3 className="mt-10 text-center text-xl">권한이 없습니다</h3>;
  }
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
    startDateYear,
    startDateMonth,
    startDateDate
  );
  const endDate = getDateFromYMDHM(endDateYear, endDateMonth, endDateDate);

  endDate.setHours(23, 59, 59); // 입력 날짜의 오전 00시를 구하기 때문에 날짜 +1해줘야 바르게 검색된다.

  const { data: findPrescriptionsData, loading: loadingPrescriptionsData } =
    useFindPrescriptionsQuery({
      variables: {
        input: {
          includeInactivate: false,
          clinicId: id,
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
    if (!loadingStatisticsData) {
      getStatisticsLzq({
        variables: {
          input: {
            startDate,
            endDate,
            ...(typeof id === "number" &&
              id !== 0 && {
                clinicId: id,
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
    if (members) {
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
  }, [members]);

  useEffect(() => {
    if (!loadingStatisticsData && dataStatistics) {
      let users: UserStatis[] = dataStatistics?.getStatistics.results!.map(
        (v) => ({
          name: v.userName,
          prescriptions: {},
        })
      );
      if (id === 0) {
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
    <div className="">
      <DashboardTitle name={name} subText="의 처방" />
      <div className="space-y-16">
        <section className="date-picker">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DashboardSectionLayout
              isPadding={true}
              children={
                <div className="space-y-4">
                  <div className="flex gap-6">
                    <div>
                      <h3>시작 날짜</h3>
                      <DatepickerWithInput
                        setValue={setValue}
                        defaultDate={defaultDate[0]}
                        register={register}
                        see="ymd"
                        dateType={"startDate"}
                      />
                    </div>
                    <div>
                      <h3>마지막 날짜</h3>
                      <DatepickerWithInput
                        setValue={setValue}
                        defaultDate={defaultDate[1]}
                        register={register}
                        see="ymd"
                        dateType={"endDate"}
                      />
                    </div>
                  </div>
                  {memberState.length >= 1 && (
                    <div className="w-full rounded-md bg-blue-400/90 text-white">
                      <div className="flex w-full flex-wrap gap-4 px-2 py-1.5">
                        {memberState.map((m, i) => (
                          <button
                            key={m.id}
                            className={cls(
                              "btn py-1 px-3 ",
                              m.isSelected
                                ? "rounded-md bg-white px-3 font-semibold text-blue-800"
                                : ""
                            )}
                            type="button"
                            onClick={() => {
                              memberState[i].isSelected =
                                !memberState[i].isSelected;
                              setMemberState([...memberState]);
                            }}
                          >
                            {m.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <DashboardBtn
                    actionText="검색"
                    isValid={
                      isValid &&
                      !loadingPrescriptionsData &&
                      !loadingStatisticsData &&
                      (id === 0 ? true : userIds.length > 0)
                    }
                    loading={loadingStatisticsData}
                  />
                </div>
              }
            />
          </form>
        </section>
        <section className="flex gap-4">
          <DashboardSectionLayout
            isPadding={true}
            children={
              <>
                <h3 className="first-:bg-red-500 text-center">
                  <div className="space-x-3 text-xl font-medium text-blue-700">
                    <span>{startDate.toLocaleDateString()}</span>
                    <span>~</span>
                    <span>{endDate.toLocaleDateString()}</span>
                  </div>
                </h3>

                <div className="grid min-h-[16rem] grid-flow-col gap-10 px-4 pt-6">
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

                <div className="grid grid-cols-[1fr_7.5rem_3.3rem] justify-between gap-3 border-t border-black text-sm">
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
            isPadding={true}
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
      </div>
    </div>
  );
};
