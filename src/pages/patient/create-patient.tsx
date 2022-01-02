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
    formState: { errors },
    handleSubmit,
    formState,
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
  const [createPatientMutation, { loading, data }] = useMutation<
    createPatientMutation,
    createPatientMutationVariables
  >(CREATE_PATIENT_MUTATION, { onCompleted });
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
        <title>Create Patient | Muool</title>
      </Helmet>
      <h1>환자 만들기</h1>
    </>
  );
};
