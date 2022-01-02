import React from "react";
import { gql, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../component/button";
import { FormError } from "../../component/form-error";
import {
  createAccountMutation,
  createAccountMutationVariables,
} from "../../__generated__/createAccountMutation";
import { CreateAccountInput } from "../../__generated__/globalTypes";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

export const CreateAccount = () => {
  const {
    register,
    getValues,
    watch,
    formState: { errors },
    handleSubmit,
    formState,
  } = useForm<CreateAccountInput>({
    mode: "onChange",
  });
  const navigate = useNavigate();
  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { ok, error },
    } = data;
    if (ok) {
      alert("Account Created! Log in now!");
      navigate("/");
    }
  };
  const [
    createAccountMutation,
    { loading, data: createaAccountMutationResult },
  ] = useMutation<createAccountMutation, createAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    { onCompleted }
  );
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: { email, password },
        },
      });
    }
  };
  return (
    <>
      <Helmet>
        <title>Create Account | Muool</title>
      </Helmet>

      <h4 className="w-full font-medium text-left text-3xl mb-5">
        Let's get started
      </h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-3 mt-5 w-full mb-5"
      >
        <input
          {...register("email", {
            required: "Email is required",
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          type="email"
          placeholder="Email"
          className="input"
        />
        {errors.email?.message && (
          <FormError errorMessage={errors.email?.message} />
        )}
        {errors.email?.type === "pattern" && (
          <FormError errorMessage={"Please enter a valid email"} />
        )}
        <input
          {...register("password", { required: "Password is required" })}
          type="password"
          placeholder="Password"
          className="input"
        />
        {errors.password?.message && (
          <FormError errorMessage={errors.password?.message} />
        )}
        {errors.password?.type === "minLength" && (
          <FormError errorMessage="Password must be more than 10 chars." />
        )}
        <Button
          canClick={formState.isValid}
          loading={loading}
          actionText={"Create Account"}
        />
        {createaAccountMutationResult?.createAccount.error && (
          <FormError
            errorMessage={createaAccountMutationResult.createAccount.error}
          />
        )}
      </form>
    </>
  );
};
