import { useReactiveVar } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import { SearchPatient } from "../components/search-patient";
import { UTC_OPTION_KST } from "../variables";
import {
  CreateReservationMutation,
  useCreateReservationMutation,
} from "../graphql/generated/graphql";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Datepicker } from "../components/datepicker";
import {
  focusGroupVar,
  groupListsVar,
  listReservationRefetchVar,
  selectedPatientVar,
} from "../store";
import { CreatePatient } from "../pages/create-patient";
import {
  PrescriptionOptionWithSelect,
  PrescriptionsSelectType,
  PrscriptionBundleWithSelect,
} from "../pages/time-table";
import { cls } from "../libs/utils";

export interface ReserveForm {
  inputYear: number;
  inputMonth: number;
  inputDate: number;
  inputHours: number;
  inputMinutes: number;
  memo: string;
  therapistId: number;
  groupId: number;
}

interface IReserve {
  startDate: Date;
  closeAction: React.Dispatch<React.SetStateAction<boolean>>;
  prescriptions: PrescriptionsSelectType;
}

export const Reserve: React.FC<IReserve> = ({
  startDate,
  closeAction,
  prescriptions,
}) => {
  const [openCreatePatient, setOpenCreatePatient] = useState(false);
  const [selectPrescriptionOptions, setSelectPrescriptionOptions] = useState(
    prescriptions.option
  );
  const [selectPrescriptionBundles, setSelectPrescriptionBundles] = useState(
    prescriptions.bundle
  );
  const [totalPrescription, setTotalPrescription] = useState({
    price: 0,
    minute: 0,
    options: [0],
    bundles: [0],
  });
  const location = useLocation();
  const selectedPatient = useReactiveVar(selectedPatientVar);
  const navigate = useNavigate();
  // 할일 : 예약하기에서 새로고침할 경우 아래 항목 때문에 디버거 활성화됨. 쿼리 시 인풋 변수가 비어있어서 에러남.
  // const listReservationRefetch = useReactiveVar(listReservationRefetchVar);
  const focusGroup = useReactiveVar(focusGroupVar);

  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
  } = useForm<ReserveForm>({ mode: "onChange" });

  const onCompleted = (data: CreateReservationMutation) => {
    const {
      createReservation: { ok, error },
    } = data;
    if (error) {
      alert(`오류가 발생했습니다; ${error}`);
    }
    // listReservationRefetch();
    if (ok) closeAction(false);
  };

  const [
    createReservationMutation,
    { loading, data: createReservationResult },
  ] = useCreateReservationMutation({ onCompleted });

  const onSubmit = () => {
    if (!loading && selectedPatient?.id) {
      const {
        inputYear,
        inputMonth,
        inputDate,
        inputHours,
        inputMinutes,
        memo,
        therapistId,
        groupId,
      } = getValues();
      const startDate = new Date(
        `${inputYear}-${String(inputMonth).padStart(2, "0")}-${String(
          inputDate
        ).padStart(2, "0")}T${String(inputHours).padStart(2, "0")}:${String(
          inputMinutes
        ).padStart(2, "0")}:00.000${UTC_OPTION_KST}`
      );
      const endDate = new Date(startDate);
      // startDate와 같은 값인 endDate에 치료시간을 분으로 더함
      endDate.setMinutes(endDate.getMinutes() + totalPrescription.minute);
      createReservationMutation({
        variables: {
          input: {
            startDate: startDate,
            endDate,
            memo,
            patientId: selectedPatient.id,
            therapistId,
            groupId: +groupId,
            prescriptionOptionIds: totalPrescription.options,
            prescriptionBundleIds: totalPrescription.bundles,
          },
        },
      });
    }
  };
  const groupLists = useReactiveVar(groupListsVar);

  const onClickPrescription = (id: number, type: "bundle" | "option") => {
    let setFunction:
      | typeof setSelectPrescriptionBundles
      | typeof setSelectPrescriptionOptions = setSelectPrescriptionOptions;
    if (type === "bundle") {
      setFunction = setSelectPrescriptionBundles;
    }
    // @ts-ignore
    setFunction((prevState) =>
      // @ts-ignore
      prevState.map((prev) => {
        if (prev.id === id) {
          return { ...prev, isSelect: !prev.isSelect };
        }
        return prev;
      })
    );
  };

  useEffect(() => {
    if (!startDate) navigate(-1);
    return () => {
      selectedPatientVar(null);
    };
  }, []);

  function getTotal(
    getThis: "price" | "requiredTime",
    firstPrescription: typeof selectPrescriptionOptions,
    secondPrescription: typeof selectPrescriptionBundles
  ) {
    return (
      firstPrescription
        .filter((pre) => pre.isSelect)
        .reduce((prev, curr) => prev + curr[getThis], 0) +
      secondPrescription
        .filter((pre) => pre.isSelect)
        .reduce((prev, curr) => prev + curr[getThis], 0)
    );
  }

  useEffect(() => {
    setTotalPrescription({
      minute: getTotal(
        "requiredTime",
        selectPrescriptionOptions,
        selectPrescriptionBundles
      ),
      price: getTotal(
        "price",
        selectPrescriptionOptions,
        selectPrescriptionBundles
      ),
      bundles: selectPrescriptionBundles
        .filter((pre) => pre.isSelect)
        .map((pre) => pre.id),
      options: selectPrescriptionOptions
        .filter((pre) => pre.isSelect)
        .map((pre) => pre.id),
    });
  }, [selectPrescriptionBundles, selectPrescriptionOptions]);

  return (
    <>
      <Helmet>
        <title>예약하기 | Muool</title>
      </Helmet>
      <div className="my-auto h-[600px] w-[400px] bg-white p-5 sm:rounded-lg">
        <button
          className="absolute right-6 top-5 hover:text-gray-400"
          onClick={() => closeAction(false)}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        {openCreatePatient ? (
          <CreatePatient closeModal={setOpenCreatePatient} />
        ) : (
          <>
            <h4 className="mb-5 w-full text-3xl font-medium">
              예약하기
              {focusGroup === null || focusGroup.id === null ? (
                ""
              ) : (
                <span className="ml-2 text-base font-normal">
                  {
                    groupLists?.find((group) => group.id === focusGroup?.id)
                      ?.name
                  }
                </span>
              )}
            </h4>
            <button
              className="absolute top-14 right-10 rounded-md border px-2 text-gray-500 hover:text-gray-700"
              onClick={() => setOpenCreatePatient((current) => !current)}
            >
              환자등록
            </button>
            <button
              className="absolute top-14 right-10 rounded-md border px-2 text-gray-500 hover:text-gray-700"
              onClick={() => setOpenCreatePatient((current) => !current)}
            >
              환자등록
            </button>
            <SearchPatient />
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-5 mb-5 grid w-full gap-3"
            >
              {errors.inputYear?.message && (
                <FormError errorMessage={errors.inputYear?.message} />
              )}
              {errors.inputMonth?.message && (
                <FormError errorMessage={errors.inputMonth?.message} />
              )}
              {errors.inputDate?.message && (
                <FormError errorMessage={errors.inputDate?.message} />
              )}
              {errors.inputHours?.message && (
                <FormError errorMessage={errors.inputHours?.message} />
              )}
              {errors.inputMinutes?.message && (
                <FormError errorMessage={errors.inputMinutes?.message} />
              )}
              <label>예약 시간</label>
              <div className="relative flex items-center justify-between">
                <Datepicker setValue={setValue} defaultDate={startDate} />
                <label className="relative flex flex-col">
                  <span className="absolute right-2 bottom-1 text-xs text-gray-500">
                    년
                  </span>
                  <input
                    {...register("inputYear", {
                      required: "연도를 입력해주세요.",
                      minLength: 4,
                      maxLength: 4,
                    })}
                    type="number"
                    className="remove-number-arrow input-number w-20"
                    placeholder="YYYY"
                    minLength={4}
                    maxLength={4}
                    max={2200}
                    min={1970}
                  />
                </label>
                <label className="relative flex flex-col">
                  <span className="absolute right-2 bottom-1 text-xs text-gray-500">
                    월
                  </span>
                  <input
                    {...register("inputMonth", {
                      required: "월을 입력해주세요.",
                      minLength: 1,
                      maxLength: 2,
                    })}
                    type="number"
                    className="remove-number-arrow input-number w-14 "
                    placeholder="MM"
                    minLength={1}
                    maxLength={2}
                    max={12}
                    min={1}
                  />
                </label>
                <label className="relative flex flex-col">
                  <span className="absolute right-2 bottom-1 text-xs text-gray-500">
                    일
                  </span>
                  <input
                    {...register("inputDate", {
                      required: "날짜를 입력해주세요.",
                      minLength: 1,
                      maxLength: 2,
                    })}
                    type="number"
                    className="remove-number-arrow input-number w-14"
                    placeholder="DD"
                    minLength={1}
                    maxLength={2}
                    max={31}
                    min={1}
                  />
                </label>
                <label className="relative flex flex-col">
                  <span className="absolute right-2 bottom-1 text-xs text-gray-500">
                    시
                  </span>
                  <input
                    {...register("inputHours", {
                      required: "시간을 입력해주세요.",
                      minLength: 1,
                      maxLength: 2,
                    })}
                    type="number"
                    className="remove-number-arrow input-number w-14"
                    placeholder="HH"
                    minLength={1}
                    maxLength={2}
                    max={23}
                    min={1}
                  />
                </label>
                <label className="relative flex flex-col">
                  <span className="absolute right-2 bottom-1 text-xs text-gray-500">
                    분
                  </span>
                  <input
                    {...register("inputMinutes", {
                      required: "분을 입력해주세요.",
                      minLength: 1,
                      maxLength: 2,
                    })}
                    type="number"
                    className="remove-number-arrow input-number w-14"
                    placeholder="mm"
                    minLength={1}
                    maxLength={2}
                    max={59}
                    min={0}
                    step={10}
                  />
                </label>
              </div>
              <label>처방</label>
              <div>
                {selectPrescriptionBundles.length === 0 &&
                selectPrescriptionOptions.length === 0 ? (
                  <div className="flex flex-col items-center px-2 text-gray-600">
                    <span>등록된 처방이 없습니다.</span>
                    <span>
                      처방을
                      <button
                        type="button"
                        className="btn-sm btn-border mx-2 w-fit shadow-cst"
                      >
                        등록
                      </button>
                      하세요
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <ul className="grid grid-cols-3">
                      {selectPrescriptionBundles.map((prescription, index) => (
                        <li
                          key={index}
                          value={prescription.id}
                          onClick={() =>
                            onClickPrescription(prescription.id, "bundle")
                          }
                        >
                          <div
                            className={cls(
                              "btn-sm btn-border",
                              prescription.isSelect
                                ? "text-red-600"
                                : "text-blue-400"
                            )}
                          >
                            {prescription.name}
                          </div>
                        </li>
                      ))}
                      {selectPrescriptionOptions.map((prescription, index) => (
                        <li
                          key={index}
                          value={prescription.id}
                          className="cursor-point"
                          onClick={() =>
                            onClickPrescription(prescription.id, "option")
                          }
                        >
                          <div
                            className={cls(
                              "btn-sm btn-border",
                              prescription.isSelect
                                ? "text-red-600"
                                : "text-blue-400"
                            )}
                          >
                            {prescription.name}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-around">
                      <span>총가격 : {totalPrescription.price}원</span>
                      <span>치료시간 : {totalPrescription.minute}분</span>
                    </div>
                  </div>
                )}
              </div>
              <Button
                canClick={selectedPatient && isValid}
                loading={loading}
                actionText={"예약 등록"}
              />
              {createReservationResult?.createReservation.error && (
                <FormError
                  errorMessage={createReservationResult.createReservation.error}
                />
              )}
            </form>
          </>
        )}
      </div>
    </>
  );
};
