import { useReactiveVar } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import { SearchPatient } from "../components/search-patient";
import { selectedPatientVar, UTC_OPTION_KST } from "../libs/variables";
import {
  CreateReservationMutation,
  useCreateReservationMutation,
} from "../graphql/generated/graphql";
import { CreatePatient } from "./create-patient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Datepicker } from "../components/datepicker";
import { listReservationRefetchVar } from "../store";

export interface ReserveForm {
  inputYear: number;
  inputMonth: number;
  inputDate: number;
  inputHours: number;
  inputMinutes: number;
  program: string;
  memo: string;
  therapistId: number;
  groupId: number;
}

export const Reserve = () => {
  const [openCreatePatient, setOpenCreatePatient] = useState(false);
  const location = useLocation();
  const state = location.state as { startDate: Date };
  const selectedPatient = useReactiveVar(selectedPatientVar);
  const navigate = useNavigate();
  const listReservationRefetch = useReactiveVar(listReservationRefetchVar);

  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
    watch,
  } = useForm<ReserveForm>({ mode: "onChange" });

  const onCompleted = (data: CreateReservationMutation) => {
    const {
      createReservation: { ok, error },
    } = data;
    if (error) {
      alert(`오류가 발생했습니다; ${error}`);
    }
    listReservationRefetch();
    navigate(-1);
  };

  const [
    createReservationMutation,
    { loading, data: createReservationResult },
  ] = useCreateReservationMutation({ onCompleted });

  const programs = {
    manual: [
      { id: 1, name: "도수치료 10분", time: 10, price: null },
      { id: 2, name: "도수치료 20분", time: 20, price: 70000 },
      { id: 3, name: "도수치료 30분", time: 30, price: 100000 },
      { id: 4, name: "도수치료 40분", time: 40, price: 140000 },
      { id: 5, name: "도수치료 50분", time: 50, price: 170000 },
      { id: 6, name: "도수치료 60분", time: 60, price: 210000 },
    ],
  };

  const onSubmit = () => {
    if (!loading && selectedPatient?.id) {
      const {
        inputYear,
        inputMonth,
        inputDate,
        inputHours,
        inputMinutes,
        program,
        memo,
        therapistId,
        groupId,
      } = getValues();
      const index = programs.manual.findIndex(
        (id) => id.id === parseInt(program)
      );
      const findProgram = programs.manual[index];
      if (!findProgram) return console.log("치료 프로그램을 찾을 수 없습니다.");
      const startDate = new Date(
        `${inputYear}-${String(inputMonth).padStart(2, "0")}-${String(
          inputDate
        ).padStart(2, "0")}T${String(inputHours).padStart(2, "0")}:${String(
          inputMinutes
        ).padStart(2, "0")}:00.000${UTC_OPTION_KST}`
      );
      const endDate = new Date(startDate);
      const minutes = findProgram.time;
      // startDate와 같은 값인 endDate에 치료시간을 분으로 더함
      endDate.setMinutes(endDate.getMinutes() + minutes);
      createReservationMutation({
        variables: {
          input: {
            startDate: startDate,
            endDate,
            memo,
            patientId: selectedPatient.id,
            therapistId,
            groupId,
          },
        },
      });
    }
  };

  useEffect(() => {
    if (!state.startDate) navigate(-1);
    return () => {
      selectedPatientVar(null);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>예약하기 | Muool</title>
      </Helmet>
      <div className="my-auto h-[600px] w-[400px] bg-white p-5 sm:rounded-lg">
        <button
          className="absolute right-6 top-5 hover:text-gray-400"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        {openCreatePatient ? (
          <CreatePatient closeModal={setOpenCreatePatient} />
        ) : (
          <>
            <h4 className=" mb-5 w-full text-left text-3xl font-medium">
              예약하기
            </h4>
            <button
              className="absolute top-14 right-10 rounded-md border px-2 text-gray-500 hover:text-gray-700"
              onClick={() => setOpenCreatePatient(!openCreatePatient)}
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
                <Datepicker
                  setValue={setValue}
                  defaultDate={state?.startDate}
                />
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
              <label>프로그램</label>
              <select {...register("program")}>
                {programs.manual.map((manual, index) => (
                  <option key={index} value={manual.id}>
                    {manual.name}
                  </option>
                ))}
              </select>
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
