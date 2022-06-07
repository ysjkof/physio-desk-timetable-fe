import {
  faCheckCircle,
  faCircleQuestion,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InputPriscription } from "../components/input-priscription";
import { DashboardSectionLayout } from "../components/section-layout";
import {
  CreatePrescriptionInput,
  useCreatePrescriptionMutation,
  useFindAtomPrescriptionsQuery,
  useFindPrescriptionsQuery,
} from "../../../graphql/generated/graphql";
import { InDashboardPageProps } from "..";
import { Button } from "../../../components/button";

export const PrescriptionPage = ({
  clinicId,
  clinicName,
  isStayed,
  isManager,
}: InDashboardPageProps) => {
  if (!isStayed) {
    return <h3 className="mt-10 text-center">권한이 없습니다</h3>;
  }
  const [atomList, setAtomList] = useState<
    { id: number; name: string; onSelect: boolean }[]
  >([]);

  const { data: findAtomPrescriptions, loading: loadingAtomPrescriptions } =
    useFindAtomPrescriptionsQuery();
  const { data: findPrescriptionsData, loading: loadingPrescriptionsData } =
    useFindPrescriptionsQuery({
      variables: {
        input: {
          includeInactivate: false,
          clinicId,
        },
      },
    });
  const [createPrescription, { loading: loadingCreatePrescriptionOption }] =
    useCreatePrescriptionMutation({
      onCompleted: (data) => {
        if (!data.createPrescription.ok) {
          alert(data.createPrescription.error);
        }
      },
    });

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { isValid, errors },
  } = useForm<CreatePrescriptionInput>({ mode: "onChange" });

  const onSubmitCreatePresciption = () => {
    if (!loadingCreatePrescriptionOption) {
      const { name, requiredTime, price, prescriptionAtomIds, description } =
        getValues();
      let prescriptionOptionIds: number[] = [];
      atomList.forEach((option) => {
        if (option.onSelect === true) {
          prescriptionOptionIds.push(option.id);
        }
      });

      createPrescription({
        variables: {
          input: {
            name,
            requiredTime: +requiredTime,
            price: +price,
            description,
            prescriptionAtomIds,
            ...(clinicId && { clinicId }),
          },
        },
      });
    }
  };

  useEffect(() => {
    setValue(
      "prescriptionAtomIds",
      atomList
        .filter((atom) => {
          atom.onSelect;
        })
        .map((atom) => atom.id)
    );
  }, [atomList]);
  useEffect(() => {
    if (!loadingAtomPrescriptions) {
      setAtomList(
        findAtomPrescriptions?.findAtomPrescriptions.results?.map((atom) => ({
          id: atom.id,
          name: atom.name,
          onSelect: false,
        })) ?? []
      );
    }
  }, [findAtomPrescriptions]);

  return (
    <>
      <section className="flex h-[15.7rem] gap-4">
        <DashboardSectionLayout
          children={
            <>
              <div className="grid grid-cols-[1fr_5rem_3.3rem_1.75rem] justify-between gap-3 border-b">
                <span className="">이름</span>
                <span className="text-right">가격</span>
                <span className="text-right">소요시간</span>
                <span className="text-center">활성</span>
              </div>
              <ul className="space-y-2 overflow-y-scroll">
                {findPrescriptionsData?.findPrescriptions.prescriptions?.map(
                  (presc) => (
                    <li
                      key={presc.id}
                      className="group relative grid grid-cols-[1fr_5rem_3.3rem_1.75rem] items-center gap-3"
                    >
                      <span className="">{presc.name}</span>
                      <span className="text-right">{presc.price}원</span>
                      <span className="text-right">{presc.requiredTime}분</span>
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        fontSize="large"
                        className={`cursor-pointer" mx-auto ${
                          presc.activate ? "text-green-500" : ""
                        }`}
                      />
                      {presc.description && (
                        <p className="bubble-arrow-t-left absolute top-7 hidden rounded-md bg-black px-3 py-2 text-white group-hover:block">
                          {presc.description}
                        </p>
                      )}
                    </li>
                  )
                )}
              </ul>
            </>
          }
        />
        {/* <DashboardSectionLayout
      title="묶음처방"
      tooltip="단일 처방을 여러개 묶은 것"
      
      children={
       <>
        <div className="grid grid-cols-[1fr_5rem_3.3rem_1.75rem] justify-between gap-3 border-b">
         <span>이름</span>
         <span className="text-right">가격</span>
         <span className="text-right">소요시간</span>
         <span className="text-center">활성</span>
        </div>
        <ul className="space-y-2 overflow-y-scroll">
         {findPrescriptionsData?.findPrescriptions.bundleResults?.map(
          (presc) => (
           <li
            key={presc.id}
            className="justify-bet group relative grid grid-cols-[1fr_5rem_3.3rem_1.75rem] items-center gap-3"
           >
            <span className="">{presc.name}</span>
            <span className="text-right">{presc.price}원</span>
            <span className="text-right">
             {presc.requiredTime}분
            </span>
            <FontAwesomeIcon
             icon={faCheckCircle}
             fontSize="large"
             className={cls(
              presc.activate ? "text-green-500" : "",
              "mx-auto cursor-pointer"
             )}
            />
            {presc.description && (
             <p className="bubble-arrow-t-left absolute top-7 hidden rounded-md bg-black px-3 py-2 text-white group-hover:block">
              {presc.description}
             </p>
            )}
           </li>
          )
         )}
        </ul>
       </>
      }
     /> */}
      </section>

      <section>
        <DashboardSectionLayout
          // title="처방 만들기"
          width="md"
          children={
            <details open={isManager && true}>
              <summary>처방 만들기</summary>
              <form
                onSubmit={handleSubmit(onSubmitCreatePresciption)}
                className="space-y-3"
              >
                <div className="prescription-selector">
                  <div className="flex items-center">
                    <h4 className="mr-4 w-9">처방</h4>
                    <div className="w-full rounded-md bg-blue-400/90 text-white">
                      <div className="flex w-full flex-wrap gap-4 px-2 py-1.5">
                        {atomList.map((option) => (
                          <button
                            type="button"
                            key={option.id}
                            className={`btn py-1 px-3 ${
                              option.onSelect
                                ? "rounded-md bg-white px-3 font-semibold text-blue-800"
                                : ""
                            }`}
                            onClick={() =>
                              setAtomList((prevState) => {
                                return prevState.map((prev) => {
                                  if (prev.id === option.id) {
                                    return {
                                      ...prev,
                                      onSelect: !prev.onSelect,
                                    };
                                  } else {
                                    return prev;
                                  }
                                });
                              })
                            }
                          >
                            {option.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <InputPriscription
                  label={"처방이름*"}
                  placeholder={"도수30, 집중형충격파1, MT20"}
                  register={register("name", {
                    required: "처방이름을 입력해주세요",
                  })}
                  type={"text"}
                >
                  <div className="group relative ml-2 flex items-center">
                    <FontAwesomeIcon icon={faCircleQuestion} fontSize="14" />
                    <p className="bubble-arrow-t-2-5 absolute top-7 -left-12 hidden w-60 rounded-md bg-black px-3 py-2 text-white group-hover:block">
                      사용하기 원하는 처방의 이름을 입력합니다.
                    </p>
                  </div>
                  {errors.name?.message && (
                    <span className="mx-auto font-semibold text-red-400">
                      {errors.name.message}
                    </span>
                  )}
                </InputPriscription>
                <div className="flex justify-between gap-6">
                  <InputPriscription
                    label={"소요시간(분)*"}
                    placeholder={"10분 단위, 0 이상의 숫자"}
                    type="number"
                    step={10}
                    register={register("requiredTime", {
                      required: "소요시간을 입력해주세요",
                      min: 10,
                      max: 180,
                    })}
                  >
                    {errors.requiredTime?.message && (
                      <span className="mx-auto font-semibold text-red-400">
                        {errors.requiredTime.message}
                      </span>
                    )}
                    {errors.requiredTime?.type === "max" && (
                      <span className="mx-auto font-semibold text-red-400">
                        최대 소요시간은 180분 입니다.
                      </span>
                    )}
                    {errors.requiredTime?.type === "min" && (
                      <span className="mx-auto font-semibold text-red-400">
                        최소 소요시간은 10분 입니다.
                      </span>
                    )}
                  </InputPriscription>

                  <InputPriscription
                    label={"가격(원)*"}
                    placeholder={"0 이상의 숫자"}
                    register={register("price", {
                      required: "가격을 입력해주세요",
                      min: 0,
                    })}
                    type={"number"}
                  >
                    {errors.price?.message && (
                      <span className="mx-auto font-semibold text-red-400">
                        {errors.price.message}
                      </span>
                    )}
                    {errors.price?.type === "min" && (
                      <span className="mx-auto font-semibold text-red-400">
                        최소 가격은 0입니다.
                      </span>
                    )}
                  </InputPriscription>
                </div>
                <InputPriscription
                  label={"설명"}
                  placeholder={"처방에 대한 설명"}
                  register={register("description")}
                  type={"text"}
                />
                <Button
                  type="submit"
                  textContents="만들기"
                  canClick={isValid}
                  isWidthFull
                  loading={loadingCreatePrescriptionOption}
                />
              </form>
            </details>
          }
        />
      </section>
    </>
  );
};
