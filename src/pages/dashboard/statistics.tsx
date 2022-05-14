import { DashboardTitle } from "./components/title";
import { DashboardSectionLayout } from "./components/section-layout";
import {
  GetStatisticsQuery,
  useFindAtomPrescriptionsQuery,
  useFindPrescriptionsQuery,
  useGetStatisticsLazyQuery,
  useGetStatisticsQuery,
} from "../../graphql/generated/graphql";
import { getDateFromYMDHM } from "../../libs/utils";
import { DatepickerForm } from "../../components/datepicker";
import { useForm } from "react-hook-form";
import { DatepickerWithInput } from "../../components/datepicker-with-input";
import { useMe } from "../../hooks/useMe";
import { useEffect, useState } from "react";
import { DashboardLi } from "./components/li";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme,
  VictoryVoronoiContainer,
} from "victory";

interface StatisticsProps {
  groupId: number;
  groupName: string;
}
export const Statistics = ({ groupId, groupName }: StatisticsProps) => {
  let defaultDate: Date[] = [new Date(), new Date()];
  defaultDate[0].setDate(1);
  defaultDate[1].setMonth(defaultDate[0].getMonth() + 1, 0);
  const { data: meData } = useMe();
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
  } = useForm<DatepickerForm>({
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

  const { data: atomPrescriptionsData, loading: loadingAtomPrescriptions } =
    useFindAtomPrescriptionsQuery();
  const { data: prescriptionsData, loading: loadingPrescriptionsData } =
    useFindPrescriptionsQuery({
      variables: {
        input: {
          includeInactivate: false,
          prescriptionType: "all",
          groupId,
        },
      },
    });
  const [stasticData, setStasticData] = useState<GetStatisticsQuery>();
  const { data: dataStatistics, loading: loadingDataStatistics } =
    useGetStatisticsQuery({
      variables: {
        input: {
          startDate,
          endDate,
          groupIds: [groupId],
        },
      },
    });
  const [
    getStasticsLzq,
    { data: dataGetStatistics, loading: loadingGetStatistics },
  ] = useGetStatisticsLazyQuery();

  const onSubmit = () => {
    if (
      !loadingAtomPrescriptions &&
      !loadingPrescriptionsData &&
      !loadingGetStatistics
    ) {
      endDate.setDate(endDate.getDate() + 1); // 입력 날짜의 오전 00시를 구하기 때문에 날짜 +1해줘야 바르게 검색된다.
      getStasticsLzq({
        variables: {
          input: {
            startDate,
            endDate,
            groupIds: [groupId],
          },
        },
      });
    }
  };

  useEffect(() => {
    console.log(loadingDataStatistics);
    setStasticData(dataStatistics);
  }, [dataStatistics]);

  useEffect(() => {
    if (!loadingGetStatistics) {
      setStasticData(dataGetStatistics);
    }
  }, [dataGetStatistics]);

  if (!prescriptionsData) return <></>;
  return (
    <div className="h-full">
      <DashboardTitle name={groupName} subText="의 처방" />
      <div className="space-y-16">
        <section className="date-picker">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DashboardSectionLayout
              children={
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
                  <button>검색</button>
                </div>
              }
            />
          </form>
        </section>
        <section className="flex h-[rem] gap-4">
          <DashboardSectionLayout
            children={
              <>
                <h3 className="first-:bg-red-500 text-center">
                  {stasticData ? (
                    <div>
                      <span className="mr-2 text-xl font-medium text-blue-700">
                        {startDate.toLocaleDateString()} ~{" "}
                        {endDate.toLocaleDateString()}
                      </span>
                      <span className="text-gray-500">통계 검색결과</span>
                    </div>
                  ) : (
                    <span className="text-xl">통계</span>
                  )}
                </h3>
                <div className="grid grid-cols-[1fr_7.5rem_3.3rem] justify-between gap-3 border-b border-black text-sm">
                  <span className="">이름</span>
                  <span className="text-center">금액</span>
                  <span className="text-center">횟수</span>
                </div>

                <ul className="space-y-2 divide-y overflow-y-scroll px-4">
                  {stasticData?.getStatistics.totalOptionList?.length! +
                    stasticData?.getStatistics.totalBundleList?.length! ===
                    0 && "자료가 없습니다."}
                  {stasticData?.getStatistics.totalOptionList?.map((presc) => (
                    <DashboardLi
                      key={presc.id}
                      name={presc.name}
                      price={
                        prescriptionsData.findPrescriptions.optionResults?.find(
                          (prescription) => prescription.id === presc.id
                        )?.price
                      }
                      count={presc.count}
                    />
                  ))}
                  {stasticData?.getStatistics.totalBundleList?.map((presc) => (
                    <DashboardLi
                      key={presc.id}
                      name={presc.name}
                      price={
                        prescriptionsData.findPrescriptions.bundleResults?.find(
                          (prescription) => prescription.id === presc.id
                        )?.price
                      }
                      count={presc.count}
                    />
                  ))}
                </ul>
              </>
            }
          />
        </section>
        <section>
          <DashboardSectionLayout
            children={
              <>
                <div className="relative">
                  {loadingGetStatistics ? (
                    ""
                  ) : (
                    <>
                      {stasticData?.getStatistics.error && (
                        <div className="absolute z-50 h-full w-full bg-gray-800/80 text-red-500">
                          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 text-2xl">
                            활성화된 사용자가 아닙니다
                          </span>
                        </div>
                      )}
                      <VictoryChart
                        height={500}
                        width={window.innerWidth}
                        domainPadding={50}
                        theme={VictoryTheme.material}
                        minDomain={{ y: 0 }}
                      >
                        <VictoryLine
                          data={stasticData?.getStatistics.dayCounts?.map(
                            (data) => ({
                              x: data.date,
                              y: data.prescriptions.reduce(
                                (prev, curr) => prev + curr.count,
                                0
                              ),
                            })
                          )}
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
                    </>
                  )}
                </div>
              </>
            }
          />
        </section>
      </div>
    </div>
  );
};
