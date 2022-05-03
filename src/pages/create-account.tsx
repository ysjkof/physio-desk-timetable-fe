import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import {
  CreateAccountInput,
  CreateAccountMutation,
  useCreateAccountMutation,
} from "../graphql/generated/graphql";

export const CreateAccount = () => {
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
    formState,
  } = useForm<CreateAccountInput>({
    mode: "onChange",
  });
  const navigate = useNavigate();
  const onCompleted = (data: CreateAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      alert("Account Created! Log in now!");
      navigate("/");
    }
  };
  const [
    createAccountMutation,
    { loading, data: createaAccountMutationResult },
  ] = useCreateAccountMutation({ onCompleted });
  const onSubmit = () => {
    if (!loading) {
      const { name, email, password } = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: { name, email, password },
        },
      });
    }
  };
  return (
    <>
      <Helmet>
        <title>Create Account | Muool</title>
      </Helmet>

      <h4 className="mb-5 w-full text-left text-3xl font-medium">
        Let's get started
      </h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 mb-5 grid w-full gap-3"
      >
        <input
          {...register("name", {
            required: "Name is required",
          })}
          type="text"
          placeholder="Name"
          className="input"
        />
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
