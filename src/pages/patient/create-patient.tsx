import React from "react";
import { gql, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  createPatientMutation,
  createPatientMutationVariables,
} from "../../__generated__/createPatientMutation";
import { CreatePatientInput } from "../../__generated__/globalTypes";
import { FormError } from "../../components/form-error";
import { Button } from "../../components/button";

const CREATE_PATIENT_MUTATION = gql`
  mutation createPatientMutation($createPatientInput: CreatePatientInput!) {
    createPatient(input: $createPatientInput) {
      ok
      error
    }
  }
`;

export const CreatePatient = () => {
  const {
    register,
    getValues,
    watch,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<CreatePatientInput>({
    mode: "onChange",
  });
  const navigate = useNavigate();

  const onCompleted = (data: createPatientMutation) => {
    const {
      createPatient: { ok, error },
    } = data;
    if (ok) {
      alert("Patient Created! Log in now!");
      navigate("/");
    }
  };
  const [
    createPatientMutation,
    { loading, data: createaPatientMutationResult },
  ] = useMutation<createPatientMutation, createPatientMutationVariables>(
    CREATE_PATIENT_MUTATION,
    { onCompleted }
  );
  const onSubmit = () => {
    if (!loading) {
      const { name, gender, birthday, memo } = getValues();
      createPatientMutation({
        variables: {
          createPatientInput: { name, gender, birthday, memo },
        },
      });
    }
  };
  return (
    <>
      <Helmet>
        <title>환자 등록 | Muool</title>
      </Helmet>
      <h4 className="mb-5 w-full text-left text-3xl font-medium">
        환자 만들기
      </h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 mb-5 grid w-full gap-3"
      >
        {errors.name?.message && (
          <FormError errorMessage={errors.name?.message} />
        )}
        <input
          {...register("name", {
            required: "Name is required",
          })}
          type="name"
          placeholder="이름"
          className="input"
        />
        {errors.gender?.message && (
          <FormError errorMessage={errors.gender?.message} />
        )}
        <div className="flex justify-around">
          <div>
            <label htmlFor="gender-male" className="px-3">
              남성
            </label>
            <input
              {...register("gender", { required: true })}
              type="radio"
              value="male"
              id="gender-male"
            />
          </div>
          <div>
            <label htmlFor="gender-female" className="px-3">
              여성
            </label>
            <input
              {...register("gender", { required: true })}
              type="radio"
              value="female"
              id="gender-female"
            />
          </div>
        </div>

        <input {...register("birthday")} type={"datetime"} className="input" />
        <input {...register("memo")} type={"text"} className="input" />

        <Button canClick={isValid} loading={loading} actionText={"환자 등록"} />
        {createaPatientMutationResult?.createPatient.error && (
          <FormError
            errorMessage={createaPatientMutationResult.createPatient.error}
          />
        )}
      </form>
    </>
  );
};
