import {
  faCheckCircle,
  faCircleQuestion,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InputPriscription } from "./components/input-priscription";
import {
  CreatePrescriptionInput,
  PrescriptionOption,
  useCreatePrescriptionMutation,
  useFindAtomPrescriptionsQuery,
  useFindPrescriptionsQuery,
} from "../../graphql/generated/graphql";
import { cls } from "../../libs/utils";
import { DashboardBtn } from "./components/button";
import { DashboardTitle } from "./components/title";
import { DashboardSectionLayout } from "./components/section-layout";
import { InDashboardPageProps } from ".";

type ValueToString<T> = { [K in keyof T]: string };
interface PickCreatePrescriptionOption
  extends Pick<
    CreatePrescriptionInput,
    "name" | "requiredTime" | "price" | "groupId"
  > {}
interface CreatePrescriptionOptionFormType
  extends ValueToString<PickCreatePrescriptionOption> {
  prescriptionId?: string;
  prescriptionOptionIds?: string[];
  description?: string;
}

interface ModefiedPrescriptionOption
  extends Pick<PrescriptionOption, "id" | "name" | "requiredTime" | "price"> {
  description?: string | null | undefined;
  prescription: {
    name: string;
  };
}
interface ModefiedPrescriptionOptionWithActivate
  extends ModefiedPrescriptionOption {
  onSelect: boolean;
}
export const Prescription = ({
  id,
  name,
  isStayed,
  isManager,
}: InDashboardPageProps) => {
  if (!isStayed) {
    return <h3 className="mt-10 text-center text-xl">권한이 없습니다</h3>;
  }
  const [selectBundle, setSelectBundle] = useState(false);
  const [selectOption, setSelectOption] = useState<
    ModefiedPrescriptionOptionWithActivate[]
  >([]);
  const { data: findAtomPrescriptions, loading: loadingAtomPrescriptions } =
    useFindAtomPrescriptionsQuery();
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
    reset,
    formState: { isValid, errors },
  } = useForm<CreatePrescriptionOptionFormType>({ mode: "onChange" });

  const onSubmitCreatePresciption = () => {
    if (!loadingCreatePrescriptionOption) {
      const { name, requiredTime, price, prescriptionId, description } =
        getValues();
      let prescriptionOptionIds: number[] = [];
      selectOption.forEach((option) => {
        if (option.onSelect === true) {
          prescriptionOptionIds.push(option.id);
        }
      });

      createPrescription({
        variables: {
          input: {
            name,
            requiredTime: parseInt(requiredTime),
            price: parseInt(price),
            description,
            ...(prescriptionOptionIds.length >= 2 && {
              prescriptionOptionIds: prescriptionOptionIds,
            }),
            ...(prescriptionId && {
              prescriptionId: parseInt(prescriptionId),
            }),
            ...(id && { groupId: id }),
          },
        },
      });
    }
  };
  function getTotalPrice(
    target: "price" | "requiredTime",
    array: ModefiedPrescriptionOptionWithActivate[]
  ) {
    return array.reduce((prev, curr) => {
      if (curr.onSelect) {
        return prev + curr[target];
      }
      return prev;
    }, 0);
  }

  useEffect(() => {
    if (selectBundle) {
      reset({
        description: "",
        name: "",
        price: getTotalPrice("price", selectOption) + "",
        requiredTime: getTotalPrice("requiredTime", selectOption) + "",
      });
    } else {
      reset({ description: "", name: "", price: "", requiredTime: "" });
    }
  }, [selectOption, selectBundle]);

  useEffect(() => {
    if (findPrescriptionsData) {
      setSelectOption(
        findPrescriptionsData.findPrescriptions.optionResults!.map((prev) => ({
          ...prev,
          onSelect: false,
        }))
      );
      setSelectBundle(false);
    }
  }, [findPrescriptionsData]);

  return (
    <div className="h-full">
      <DashboardTitle name={name} subText="의 처방" />
      <div className="space-y-16">
        <section className="flex h-[15.7rem] gap-4">
          <DashboardSectionLayout
            title="단일처방"
            isPadding={true}
            children={
              <>
                <div className="grid grid-cols-[1fr_5rem_3.3rem_1.75rem] justify-between gap-3 border-b text-sm">
                  <span className="">이름</span>
                  <span className=" text-right">가격</span>
                  <span className=" text-right">소요시간</span>
                  <span className=" text-center">활성</span>
                </div>
                <ul className="space-y-2 overflow-y-scroll">
                  {findPrescriptionsData?.findPrescriptions.optionResults?.map(
                    (presc) => (
                      <li
                        key={presc.id}
                        className="group relative grid grid-cols-[1fr_5rem_3.3rem_1.75rem] items-center gap-3"
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
          />
          <DashboardSectionLayout
            title="묶음처방"
            tooltip="단일 처방을 여러개 묶은 것"
            isPadding={true}
            children={
              <>
                <div className="grid grid-cols-[1fr_5rem_3.3rem_1.75rem] justify-between gap-3 border-b text-sm">
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
          />
        </section>

        <section>
          <DashboardSectionLayout
            // title="처방 만들기"
            width="md"
            isPadding={true}
            children={
              <details open={isManager && true}>
                <summary>처방 만들기</summary>
                <form
                  onSubmit={handleSubmit(onSubmitCreatePresciption)}
                  className="space-y-3"
                >
                  <div className="prescription-selector">
                    <div className="flex items-center">
                      <h4 className="mr-4 w-9 text-sm">유형</h4>
                      <div className="flex w-full justify-around">
                        <div
                          className={cls(
                            "flex rounded-t-md px-2 pt-2 pb-1",
                            selectBundle ? "" : "bg-blue-400/90 text-blue-800"
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectBundle(false)}
                            className="rounded-md bg-white px-3 py-1"
                          >
                            단일 처방
                          </button>
                        </div>
                        <div
                          className={cls(
                            "flex items-center gap-1 rounded-t-md px-2 pt-2 pb-1",
                            selectBundle ? "bg-blue-400/90 text-blue-800" : ""
                          )}
                        >
                          <button
                            type="button"
                            className={cls(
                              "flex gap-1 py-1 pl-3 pr-2",
                              findPrescriptionsData?.findPrescriptions
                                .optionResults?.length! <= 1
                                ? "pointer-events-none text-gray-400"
                                : "rounded-md bg-white"
                            )}
                            onClick={() => setSelectBundle(true)}
                          >
                            묶음 처방
                            <div className="group relative">
                              <FontAwesomeIcon icon={faCircleQuestion} />
                              <p className="bubble-arrow-t-left absolute top-8 -left-6 hidden w-60 rounded-md bg-black py-2 px-2 text-white group-hover:block">
                                단일처방을 모아 놓은 묶음처방입니다. 단일처방이
                                2개 이상 있어야 활성화됩니다.
                              </p>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <h4 className="mr-4 w-9 text-sm">처방</h4>
                      <div className="w-full rounded-md bg-blue-400/90 text-white">
                        <div className="flex w-full flex-wrap gap-4 px-2 py-1.5">
                          {selectBundle
                            ? selectOption.map((option) => (
                                <button
                                  type="button"
                                  key={option.id}
                                  className={cls(
                                    "btn py-1 px-3",
                                    option.onSelect
                                      ? "rounded-md bg-white px-3 font-semibold text-blue-800"
                                      : ""
                                  )}
                                  onClick={() =>
                                    setSelectOption((prevState) => {
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
                              ))
                            : findAtomPrescriptions?.findAtomPrescriptions.results?.map(
                                (atom) => (
                                  <Fragment key={atom.id}>
                                    <input
                                      id={atom.id + atom.name}
                                      className="hidden select-none"
                                      {...register("prescriptionId", {
                                        required: "처방을 선택하세요",
                                      })}
                                      type="radio"
                                      value={atom.id}
                                    />
                                    <label
                                      className="btn py-1 px-3 "
                                      htmlFor={atom.id + atom.name}
                                    >
                                      {atom.name}
                                    </label>
                                  </Fragment>
                                )
                              )}
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
                  <DashboardBtn
                    actionText="만들기"
                    isValid={isValid}
                    loading={loadingCreatePrescriptionOption}
                  />
                </form>
              </details>
            }
          />
        </section>
      </div>
    </div>
  );
};
