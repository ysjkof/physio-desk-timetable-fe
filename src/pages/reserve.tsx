import { gql, useMutation, useReactiveVar } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import { NameTag } from "../components/name-tag";
import { SearchPatient } from "../components/search-patient";
import {
  REGEX_HHMM,
  REGEX_YYYYMMDD,
  selectedPatientVar,
  UTC_OPTION_KST,
} from "../libs/variables";
import { getHHMM, getYMD } from "../libs/utils";
import {
  createReservationMutation,
  createReservationMutationVariables,
} from "../__generated__/createReservationMutation";
import { ModalPortal } from "../components/mordal-portal";

const CREATE_RESERVATION_MUTATION = gql`
  mutation createReservationMutation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      ok
      error
    }
  }
`;

export const Reserve = () => {
  const location = useLocation();
  const state = location.state as { startDate: Date };
  const selectedPatient = useReactiveVar(selectedPatientVar);
  const navigate = useNavigate();

  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({ mode: "onChange" });

  const onCompleted = (data: createReservationMutation) => {
    const {
      createReservation: { ok, error },
    } = data;
    navigate(-1);
  };

  const [
    createReservationMutation,
    { loading, data: createReservationResult },
  ] = useMutation<
    createReservationMutation,
    createReservationMutationVariables
  >(CREATE_RESERVATION_MUTATION, { onCompleted });

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
      const { startYDM, startHHMM, program, memo, therapistId, groupId } =
        getValues();
      const index = programs.manual.findIndex(
        (id) => id.id === parseInt(program)
      );
      const findProgram = programs.manual[index];
      if (!findProgram) return console.log("치료 프로그램을 찾을 수 없습니다.");
      const startDate = new Date(
        `${startYDM}T${startHHMM}:00.000${UTC_OPTION_KST}`
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
    return () => {
      selectedPatientVar(null);
    };
  }, []);

  return (
    <ModalPortal>
      <Helmet>
        <title>예약하기 | Muool</title>
      </Helmet>
      <div className="my-auto bg-white p-5 sm:rounded-lg">
        <h4 className=" mb-5 w-full text-left text-3xl font-medium">
          예약하기
        </h4>
        <SearchPatient />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-5 mb-5 grid w-full gap-3"
        >
          {errors.startYDM?.message && (
            <FormError errorMessage={errors.startYDM?.message} />
          )}
          <label>예약 시간</label>
          <div className="flex">
            <input
              {...register("startYDM", {
                required: "시작 시간을 입력해주세요.",
                pattern: REGEX_YYYYMMDD,
              })}
              type="text"
              className="input"
              placeholder="yyyy-mm-dd"
              defaultValue={
                state?.startDate ? getYMD(state.startDate, "yyyymmdd", "-") : ""
              }
            />
            <input
              {...register("startHHMM", {
                required: true,
                pattern: REGEX_HHMM,
              })}
              type="text"
              className="input"
              placeholder="HH:MM"
              defaultValue={
                state?.startDate ? getHHMM(state.startDate, ":") : ""
              }
            />
          </div>
          <label>프로그램</label>
          <select {...register("program")}>
            {programs.manual.map((manual, index) => (
              <option value={manual.id}>{manual.name}</option>
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
      </div>
    </ModalPortal>
  );
};
