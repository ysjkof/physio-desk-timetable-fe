import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { UTC_OPTION_KST } from "../../constants";
import {
  createReservationMutation,
  createReservationMutationVariables,
} from "../../__generated__/createReservationMutation";
import { ModalPortal } from "./mordal-portal";
import { getYMD, getHHMM } from "../../hooks/handleTimeFormat";

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
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({ mode: "onChange" });

  const [
    createReservationMutation,
    { loading, data: createReservationResult },
  ] = useMutation<
    createReservationMutation,
    createReservationMutationVariables
  >(CREATE_RESERVATION_MUTATION);

  const onSubmit = () => {
    if (!loading) {
      const {
        startDate,
        startTime,
        endDate,
        endTime,
        code,
        memo,
        patientId,
        therapistId,
        groupId,
      } = getValues();

      createReservationMutation({
        variables: {
          input: {
            startDate: `${startDate}T${startTime}:00.000${UTC_OPTION_KST}`,
            endDate: `${endDate}T${endTime}:00${UTC_OPTION_KST}`,
            memo,
            patientId: parseInt(patientId),
            therapistId,
            groupId,
          },
        },
      });
    }
  };

  console.log("⚠️ :1", state);
  return (
    <ModalPortal>
      <Helmet>
        <title>예약하기 | Muool</title>
      </Helmet>
      <div className="my-auto bg-white p-5 sm:rounded-lg">
        <h4 className=" mb-5 w-full text-left text-3xl font-medium">
          예약하기
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-5 mb-5 grid w-full gap-3"
        >
          {errors.startDate?.message && (
            <FormError errorMessage={errors.startDate?.message} />
          )}
          <label>예약 시간</label>
          <div className="flex">
            <input
              {...register("startDate", {
                required: "시작 시간을 입력해주세요.",
              })}
              type="text"
              className="input"
              placeholder="yyyy-mm-dd"
              defaultValue={
                state?.startDate ? getYMD(state.startDate, "yyyymmdd", "-") : ""
              }
            />
            <input
              {...register("startTime", {
                required: true,
              })}
              type="text"
              className="input"
              placeholder="HH:MM"
              defaultValue={
                state?.startDate ? getHHMM(state.startDate, ":") : ""
              }
            />
          </div>

          <label>환자</label>
          <input
            {...register("patientId", { required: "환자ID를 입력하세요" })}
            type="number"
            placeholder="patientId"
            className="input"
            autoFocus
            id="patientId"
          />
          <datalist id="patientId">{/* 환자 찾아서 목록으로 */}</datalist>

          <label>프로그램</label>
          <input
            {...register("code")}
            type={"text"}
            placeholder="code"
            className="input"
          />
          {errors.patientId?.message && (
            <FormError errorMessage={errors.patientId?.message} />
          )}

          <Button
            canClick={isValid}
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
