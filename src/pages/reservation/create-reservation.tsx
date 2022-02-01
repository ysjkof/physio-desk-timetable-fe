import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { UTC_OPTION_KST } from "../../constants";
import {
  createReservationMutation,
  createReservationMutationVariables,
} from "../../__generated__/createReservationMutation";

const CREATE_RESERVATION_MUTATION = gql`
  mutation createReservationMutation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      ok
      error
    }
  }
`;

export const CreateReservation = () => {
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

  const yyyyMmDd = () => {
    const now = new Date(Date.now());
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <>
      <Helmet>
        <title>예약하기 | Muool</title>
      </Helmet>
      <div className="px-5 lg:px-60">
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
          <label>시작 시간</label>
          <div className="flex">
            <input
              {...register("startDate", {
                required: "시작 시간을 입력해주세요.",
              })}
              type="text"
              className="input"
              placeholder="yyyy-mm-dd"
              defaultValue={yyyyMmDd()}
            />
            <input
              {...register("startTime", {
                required: true,
              })}
              type="text"
              className="input"
              placeholder="HH:MM"
            />
          </div>
          <label>종료 시간</label>
          <div className="flex">
            <input
              {...register("endDate", {
                required: true,
              })}
              type="text"
              className="input"
              placeholder="yyyy-mm-dd"
              defaultValue={yyyyMmDd()}
            />
            <input
              {...register("endTime", {
                required: true,
              })}
              type="text"
              className="input"
              placeholder="HH:MM"
            />
          </div>
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
          <label>환자ID</label>
          <input
            {...register("patientId", { required: "환자ID를 입력하세요" })}
            type="number"
            placeholder="patientId"
            className="input"
          />

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
    </>
  );
};
