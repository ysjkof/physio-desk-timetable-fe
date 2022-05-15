import { DashboardTitle } from "./components/title";
import { DashboardSectionLayout } from "./components/section-layout";
import {
  useFindPrescriptionsQuery,
  useGetStatisticsQuery,
} from "../../graphql/generated/graphql";
import { getDateFromYMDHM } from "../../libs/utils";
import { DatepickerForm } from "../../components/datepicker";
import { useForm } from "react-hook-form";
import { DatepickerWithInput } from "../../components/datepicker-with-input";
import { DashboardLi } from "./components/li";
import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme } from "victory";
import { InDashboardPageProps } from ".";

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

  endDate.setHours(23, 59, 59); // 입력 날짜의 오전 00시를 구하기 때문에 날짜 +1해줘야 바르게 검색된다.

  const { data: findPrescriptionsData, loading: loadingPrescriptionsData } =
    useFindPrescriptionsQuery({
      variables: {
        input: {
          includeInactivate: false,
          prescriptionType: "all",
          groupId: id,
        },
      },
    });

  const { data: dataStatistics, loading: loadingDataStatistics } =
    useGetStatisticsQuery({
      variables: {
        input: {
          startDate,
          endDate,
          groupIds: [id],
        },
      },
    });

  const onSubmit = () => {
    if (!loadingPrescriptionsData) {
    }
  };

  return (
    <div className="h-full">
      <DashboardTitle name={name} subText="의 처방" />
      <div className="space-y-16">
        <section className="date-picker">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DashboardSectionLayout
              isPadding={true}
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
                <div className="grid grid-cols-[1fr_7.5rem_3.3rem] justify-between gap-3 border-b border-black text-sm">
                  <span className="">이름</span>
                  <span className="text-center">금액</span>
                  <span className="text-center">횟수</span>
                </div>

                <ul className="h-96 space-y-4 overflow-y-scroll px-4">
                  {dataStatistics?.getStatistics.totalOptionList?.length! +
                    dataStatistics?.getStatistics.totalBundleList?.length! ===
                    0 && "자료가 없습니다."}
                  {dataStatistics?.getStatistics.totalOptionList?.map(
                    (presc) => (
                      <DashboardLi
                        key={presc.id}
                        name={presc.name}
                        price={
                          findPrescriptionsData?.findPrescriptions.optionResults?.find(
                            (prescription) => prescription.id === presc.id
                          )?.price
                        }
                        count={presc.count}
                      />
                    )
                  )}
                  {dataStatistics?.getStatistics.totalBundleList?.map(
                    (presc) => (
                      <DashboardLi
                        key={presc.id}
                        name={presc.name}
                        price={
                          findPrescriptionsData?.findPrescriptions.bundleResults?.find(
                            (prescription) => prescription.id === presc.id
                          )?.price
                        }
                        count={presc.count}
                      />
                    )
                  )}
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
                        dataStatistics
                          ? dataStatistics.getStatistics.dayCounts?.map(
                              (data) => ({
                                x: data.date,
                                y: data.prescriptions.reduce(
                                  (prev, curr) => prev + curr.count,
                                  0
                                ),
                              })
                            )
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
