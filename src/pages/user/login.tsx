import React from "react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { authTokenVar, isLoggedInVar } from "../../apollo";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import {
  loginMutation,
  loginMutationVariables,
} from "../../__generated__/loginMutation";
import { LoginInput } from "../../__generated__/globalTypes";
import { LOCALSTORAGE_TOKEN } from "../../constants";
import { Helmet } from "react-helmet-async";

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

export const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<LoginInput>({ mode: "onChange" });

  const onCompleted = (data: loginMutation) => {
    const {
      login: { error, ok, token },
    } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
      navigate("/");
    }
  };

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Muool</title>
      </Helmet>

      <h4 className="mb-5 w-full text-left text-3xl font-medium">
        물리치료사를 위한 하나의 앱
      </h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 mb-5 grid w-full gap-3"
      >
        {errors.email?.message && (
          <FormError errorMessage={errors.email?.message} />
        )}
        {errors.email?.type === "pattern" && (
          <FormError errorMessage={"Please enter a valid email"} />
        )}
        <input
          type="email"
          placeholder="Email"
          className="input "
          {...register("email", {
            required: "Email is required",
            pattern:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
        />
        {errors.password?.message && (
          <FormError errorMessage={errors.password?.message} />
        )}
        {errors.password?.type === "minLength" && (
          <FormError errorMessage="Password must be more than 10 chars." />
        )}
        <input
          type="password"
          placeholder="Password"
          className="input"
          {...register("password", { required: "Password is required" })}
        />
        <Button canClick={isValid} loading={loading} actionText={"Log in"} />
        {loginMutationResult?.login.error && (
          <FormError errorMessage={loginMutationResult.login.error} />
        )}
      </form>
    </>
  );
};
