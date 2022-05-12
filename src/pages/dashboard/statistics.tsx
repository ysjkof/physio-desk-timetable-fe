import { DashboardTitle } from "./components/title";
import { DashboardSectionLayout } from "./components/section-layout";
import {
  GetStasticsQuery,
  useFindAtomPrescriptionsQuery,
  useFindPrescriptionsQuery,
  useGetStasticsLazyQuery,
} from "../../graphql/generated/graphql";
import { getDateFromYMDHM } from "../../libs/utils";
import { DatepickerForm } from "../../components/datepicker";
import { useForm } from "react-hook-form";
import { DatepickerWithInput } from "../../components/datepicker-with-input";
import { useMe } from "../../hooks/useMe";
import { useEffect, useState } from "react";

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
  const [stasticData, setStasticData] = useState<GetStasticsQuery>();
  const [getStasticsLzq, { data, loading: loadingGetStastics }] =
    useGetStasticsLazyQuery();
  stasticData;
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

  const onSubmit = () => {
    if (
      !loadingAtomPrescriptions &&
      !loadingPrescriptionsData &&
      !loadingGetStastics
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
    if (!loadingGetStastics) {
      setStasticData(data);
    }
  }, [, data]);

  useEffect(() => {
    setStasticData(undefined);
  }, [groupId]);

  if (!prescriptionsData) return <></>;
  return (
    <div className="h-full">
      <DashboardTitle name={groupName} subText="의 처방" />

      <div className="space-y-16">
        <section>
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
        <section className="flex h-[15.7rem] gap-4">
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
                  {stasticData?.getStastics.totalOptionList?.map((presc) => (
                    <li
                      key={presc.id}
                      className="group relative grid grid-cols-[1fr_7.5rem_3.3rem] items-center gap-3"
                    >
                      <span className="">{presc.name}</span>
                      <span className="text-right">
                        {typeof prescriptionsData.findPrescriptions.optionResults?.find(
                          (prescription) => prescription.id === presc.id
                        )?.price === "number"
                          ? Number(
                              prescriptionsData.findPrescriptions.optionResults?.find(
                                (op) => op.id === presc.id
                              )?.price
                            ) * presc.count
                          : 0}
                        원
                      </span>
                      <span className="text-right">{presc.count}번</span>
                    </li>
                  ))}
                  {stasticData?.getStastics.totalBundleList?.map((presc) => (
                    <li
                      key={presc.id}
                      className="group relative grid grid-cols-[1fr_7.5rem_3.3rem] items-center gap-3"
                    >
                      <span className="">{presc.name}</span>
                      <span className="text-right">
                        {typeof prescriptionsData.findPrescriptions.bundleResults?.find(
                          (prescription) => prescription.id === presc.id
                        )?.price === "number"
                          ? Number(
                              prescriptionsData.findPrescriptions.bundleResults?.find(
                                (op) => op.id === presc.id
                              )?.price
                            ) * presc.count
                          : 0}
                        원
                      </span>
                      <span className="text-right">{presc.count}번</span>
                    </li>
                  ))}
                </ul>
              </>
            }
          />
        </section>
      </div>
    </div>
  );
};
