import {
  faCheckCircle,
  faCircleQuestion,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DashboardSectionLayout } from "../components/section-layout";
import {
  CreatePrescriptionInput,
  useCreatePrescriptionMutation,
  useFindAtomPrescriptionsQuery,
  useFindPrescriptionsQuery,
} from "../../../graphql/generated/graphql";
import { InDashboardPageProps } from "..";
import { Button } from "../../../components/molecules/button";
import { selectedClinicVar } from "../../../store";
import { useReactiveVar } from "@apollo/client";
import { Input } from "../../../components/molecules/input";
import { FormError } from "../../../components/form-error";
import { REGEX_NUMBER_END_DIGIT_OF_ZERO } from "../../../variables";
import { BtnMenu } from "../../../components/molecules/button-menu";

export const PrescriptionPage = ({}: InDashboardPageProps) => {
  const selectedClinic = useReactiveVar(selectedClinicVar);

  const [atomList, setAtomList] = useState<
    { id: number; name: string; onSelect: boolean }[]
  >([]);

  const { data: findAtomPrescriptions, loading: loadingAtomPrescriptions } =
    useFindAtomPrescriptionsQuery();
  const { data: findPrescriptionsData, loading: loadingPrescriptionsData } =
    useFindPrescriptionsQuery({
      variables: {
        input: {
          clinicId: selectedClinic ? selectedClinic.id : 0,
          onlyLookUpActive: false,
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
  const { name, requiredTime, price, prescriptionAtomIds, description } =
    getValues();

  const onSubmitCreatePresciption = () => {
    if (!loadingCreatePrescriptionOption) {
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
            clinicId: selectedClinic ? selectedClinic.id : 0,
          },
        },
      });
    }
  };

  function onClickAtom(atomId: number) {
    const newAtomList = atomList.map((prev) => {
      if (prev.id === atomId) {
        return {
          ...prev,
          onSelect: !prev.onSelect,
        };
      } else {
        return prev;
      }
    });

    setValue(
      "prescriptionAtomIds",
      newAtomList.filter((atom) => atom.onSelect).map((atom) => atom.id)
    );
    setAtomList(newAtomList);
  }

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
      {selectedClinic?.isStayed ? (
        <div className="flex h-full w-full">
          <DashboardSectionLayout
            width="md"
            heightFull
            children={
              <>
                <div className="grid grid-cols-[1fr_5rem_3.3rem_1.75rem] justify-between gap-3 border-b">
                  <span className="">이름</span>
                  <span className="text-right">가격</span>
                  <span className="text-right">소요시간</span>
                  <span className="text-center">활성</span>
                </div>
                <ul className="space-y-2 overflow-y-scroll">
                  {findPrescriptionsData?.findPrescriptions.prescriptions
                    ?.length === 0 ? (
                    <p className="py-10 text-center font-semibold">
                      병원에 등록된 처방이 없습니다
                    </p>
                  ) : (
                    findPrescriptionsData?.findPrescriptions.prescriptions?.map(
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
                    )
                  )}
                </ul>
              </>
            }
          />
          <DashboardSectionLayout
            width="md"
            heightFull
            children={
              <details open={selectedClinic.isManager}>
                <summary>처방 만들기</summary>
                <form
                  onSubmit={handleSubmit(onSubmitCreatePresciption)}
                  className="space-y-2 pt-4 pb-2"
                >
                  <div className="prescription-selector flex items-center">
                    <h4 className="mr-4 w-9">처방*</h4>
                    <div className="flex w-full flex-wrap gap-4 px-2 py-1.5">
                      {atomList.map((option) => (
                        <BtnMenu
                          key={option.id}
                          label={option.name}
                          hasBorder
                          hasActiveRing
                          thinFont
                          enabled={option.onSelect}
                          onClick={() => onClickAtom(option.id)}
                        />
                      ))}
                    </div>
                  </div>
                  <Input
                    required
                    label={"처방이름*"}
                    name="name"
                    placeholder={"도수30, 집중형충격파1, MT20"}
                    register={register("name", {
                      required: "처방이름을 입력해주세요",
                      maxLength: { value: 15, message: "최대 15자 입니다" },
                    })}
                    type={"text"}
                    children={
                      <>
                        <div className="group absolute left-[3.2rem] top-[0.08rem] cursor-pointer">
                          <FontAwesomeIcon
                            icon={faCircleQuestion}
                            fontSize={14}
                          />
                          <p className="bubble-arrow-t-2-5 absolute top-7 -left-12 hidden w-60 rounded-md bg-black px-3 py-2 text-white group-hover:block">
                            사용하기 원하는 처방의 이름을 입력합니다.
                          </p>
                        </div>
                        {errors.name?.message && (
                          <FormError errorMessage={errors.name.message} />
                        )}
                      </>
                    }
                  />
                  <div className="flex justify-between gap-6">
                    <Input
                      name="requiredTime"
                      required
                      label={"소요시간(분)*"}
                      placeholder={"10분 단위, 0 이상의 숫자"}
                      type="number"
                      step={10}
                      register={register("requiredTime", {
                        required: "시간을 입력해주세요",
                        min: { value: 10, message: "최소 10분입니다" },
                        max: { value: 180, message: "최대 180분입니다" },
                        pattern: REGEX_NUMBER_END_DIGIT_OF_ZERO,
                      })}
                      children={
                        <>
                          {errors.requiredTime?.message && (
                            <FormError
                              errorMessage={errors.requiredTime.message}
                            />
                          )}
                          {errors.requiredTime?.type === "pattern" && (
                            <FormError errorMessage={"10분 단위로 입력"} />
                          )}
                        </>
                      }
                    />
                    <Input
                      required
                      name="price"
                      label={"가격(원)*"}
                      placeholder={"0 이상의 숫자"}
                      register={register("price", {
                        required: "가격을 입력해주세요",
                        min: { value: 0, message: "최소 0입니다" },
                        max: {
                          value: 100000000,
                          message: "더 이상 불가합니다",
                        },
                      })}
                      type={"number"}
                      children={
                        errors.price?.message && (
                          <FormError errorMessage={errors.price.message} />
                        )
                      }
                    />
                  </div>
                  <Input
                    name="description"
                    label={"설명"}
                    placeholder={"처방에 대한 설명"}
                    register={register("description", {
                      maxLength: { value: 200, message: "최대 200자입니다" },
                    })}
                    type={"textarea"}
                    rows={4}
                    children={
                      errors.description?.message && (
                        <FormError errorMessage={errors.description.message} />
                      )
                    }
                  />
                  <Button
                    type="submit"
                    textContents="만들기"
                    canClick={isValid && prescriptionAtomIds?.length !== 0}
                    isWidthFull
                    loading={loadingCreatePrescriptionOption}
                  />
                </form>
              </details>
            }
          />
        </div>
      ) : (
        <h3 className="mx-auto mt-10 text-center">권한이 없습니다</h3>
      )}
    </>
  );
};
