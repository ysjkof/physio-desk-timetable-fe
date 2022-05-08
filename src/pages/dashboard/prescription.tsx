import {
  faCheckCircle,
  faCircleQuestion,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { InputPriscription } from "../../components/input-priscription";
import {
  CreatePrescriptionInput,
  PrescriptionOption,
  useCreatePrescriptionMutation,
  useFindAtomPrescriptionsQuery,
  useFindPrescriptionsQuery,
} from "../../graphql/generated/graphql";
import { cls } from "../../libs/utils";

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
interface PrescriptionProps {
  groupId: number | undefined;
  groupName: string | undefined;
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
export const Prescription: React.FC<PrescriptionProps> = ({
  groupId,
  groupName,
}) => {
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
          groupId: groupId,
        },
      },
    });
  const [createPrescription, { loading: loadingCreatePrescriptionOption }] =
    useCreatePrescriptionMutation();

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { isValid },
  } = useForm<CreatePrescriptionOptionFormType>({ mode: "onChange" });

  const onSubmitCreatePresciption = () => {
    if (!loadingCreatePrescriptionOption) {
      const {
        name,
        requiredTime,
        price,
        prescriptionId,
        description,
        groupId,
      } = getValues();
      // console.log(name, requiredTime, price, prescriptionId, description);
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
            ...(groupId && { groupId: parseInt(groupId) }),
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

  if (!findPrescriptionsData) return <></>;
  // console.log(findPrescriptionsData.findPrescriptions.optionResults);
  return (
    <div className="h-full space-y-6">
      <div></div>
      <h2 className="title border-b">
        <span className="font-medium">{groupName}</span>
        <span className="text-sm text-gray-500">의 처방</span>
      </h2>
      <section className="flex w-full gap-4">
        <div className="w-full space-y-2">
          <h3>단일 처방</h3>
          <ul className="space-y-2 pl-4">
            <li className="relative grid grid-cols-[1fr_5rem_3.3rem_1.75rem] justify-between gap-3 border-b text-sm">
              <span className="">이름</span>
              <span className=" text-right">가격</span>
              <span className=" text-right">소요시간</span>
              <span className=" text-center">활성</span>
            </li>
            {findPrescriptionsData.findPrescriptions.optionResults?.map(
              (presc) => (
                <li
                  key={presc.id}
                  className="justify-bet group relative grid grid-cols-[1fr_5rem_3.3rem_1.75rem] items-center gap-3"
                >
                  <span className="">{presc.name}</span>
                  <span className="text-right">{presc.price}원</span>
                  <span className="text-right">{presc.requiredTime}분</span>
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
        </div>
        <div className="w-full space-y-2">
          <h3 className="group relative">
            묶음 처방 <FontAwesomeIcon icon={faCircleQuestion} />
            <p className="bubble-arrow-t-left absolute top-8 z-50 hidden rounded-md bg-black px-3 py-2 text-white group-hover:block">
              단일 처방을 여러개 묶은 것
            </p>
          </h3>
          <ul className="space-y-2 pl-4">
            <li className="relative grid grid-cols-[1fr_5rem_3.3rem_1.75rem] justify-between gap-3 border-b text-sm">
              <span className="">이름</span>
              <span className=" text-right">가격</span>
              <span className=" text-right">소요시간</span>
              <span className=" text-center">활성</span>
            </li>
            {findPrescriptionsData.findPrescriptions.bundleResults?.map(
              (presc) => (
                <li
                  key={presc.id}
                  className="justify-bet group relative grid grid-cols-[1fr_5rem_3.3rem_1.75rem] items-center gap-3"
                >
                  <span className="">{presc.name}</span>
                  <span className="text-right">{presc.price}원</span>
                  <span className="text-right">{presc.requiredTime}분</span>
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
        </div>
      </section>
      {/* {findPrescriptionsData.findPrescriptions.bundleResults?.length === 0 ? 0 : 1} */}
      <section>
        <h3 className="mb-6 border-b font-medium">새로 만들기</h3>
        <div className="form-header flex max-w-sm flex-col">
          <div>
            <div className="flex items-center">
              <h4 className="mr-4 w-9">유형</h4>
              <div className="flex w-full justify-around">
                <div
                  className={cls(
                    selectBundle ? "" : "bg-blue-400/90 text-white",
                    "flex items-center gap-2 rounded-t-md px-4 py-1"
                  )}
                >
                  <button onClick={() => setSelectBundle(false)}>
                    단일 처방
                  </button>
                </div>
                <div
                  className={cls(
                    selectBundle ? "bg-blue-400/90 text-white" : "",
                    "flex items-center gap-2 rounded-t-md px-4 py-1"
                  )}
                >
                  <button
                    className={cls(
                      findPrescriptionsData.findPrescriptions.optionResults
                        ?.length! <= 1
                        ? "pointer-events-none text-gray-400"
                        : ""
                    )}
                    onClick={() => setSelectBundle(true)}
                  >
                    묶음 처방
                  </button>
                  <div className="group relative">
                    <FontAwesomeIcon icon={faCircleQuestion} />
                    <p className="bubble-arrow-t-left absolute top-9 hidden w-60 rounded-md bg-black px-3 py-2 text-white group-hover:block">
                      단일처방을 모아 놓은 묶음처방입니다. 단일처방이 2개 이상
                      있어야 활성화됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <h4 className="mr-4 w-9">처방</h4>
              <div className="w-full rounded-md bg-blue-400/90 text-white">
                <div className="flex w-full gap-4 px-2 py-1.5">
                  {selectBundle
                    ? selectOption.map((option) => (
                        <span
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
                                  return { ...prev, onSelect: !prev.onSelect };
                                } else {
                                  return prev;
                                }
                              });
                            })
                          }
                        >
                          {option.name}
                        </span>
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
        </div>
        <form
          onSubmit={handleSubmit(onSubmitCreatePresciption)}
          className="flex max-w-sm flex-col space-y-3"
        >
          <InputPriscription
            label={"처방이름*"}
            placeholder={"예) 도수20, 방사형충격파1, MT20, r-eswt1 ..."}
            register={register("name", {
              required: "Name is required",
            })}
            type={"text"}
            required={true}
          >
            <div className="group relative ml-2 flex items-center">
              <FontAwesomeIcon icon={faCircleQuestion} fontSize="14" />
              <p className="bubble-arrow-t-2-5 absolute top-7 -left-12 hidden w-60 rounded-md bg-black px-3 py-2 text-white group-hover:block">
                사용하기 원하는 처방의 이름을 입력합니다.
              </p>
            </div>
          </InputPriscription>
          <InputPriscription
            label={"소요시간"}
            placeholder={"0 이상의 숫자를 10분 단위로 입력합니다"}
            type="number"
            required={true}
            step={10}
            register={register("requiredTime", {
              required: "RequiredTime is required",
              min: 10,
              max: 120,
            })}
          />
          <InputPriscription
            label={"가격"}
            placeholder={"0 이상의 숫자를 입력합니다"}
            register={register("price", {
              required: "Price is required",
            })}
            type={"number"}
            required={true}
          />
          <InputPriscription
            label={"설명"}
            placeholder={"처방에 대한 설명을 입력합니다"}
            register={register("description")}
            type={"text"}
            required={false}
          />
          <Button
            canClick={isValid}
            loading={loadingCreatePrescriptionOption}
            actionText={"만들기"}
          />
        </form>
        <div className="create-form">
          {/* 번들일 경우 처방옵션 선택해야됨*/}
        </div>
      </section>
    </div>
  );
};
