import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  LoginInput,
  LoginMutation,
  useLoginMutation,
} from "../../graphql/generated/graphql";
import { LOCALSTORAGE_TOKEN } from "../../variables";
import { authTokenVar, isLoggedInVar } from "../../apollo";
import { FormError } from "../../components/form-error";
import { Button } from "../../components/button";

export const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<LoginInput>({ mode: "onChange" });

  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (!ok) {
      alert("로그인이 유효하지 않습니다.");
    }
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
      navigate("/");
    }
  };

  const [loginMutation, { data: loginMutationResult, loading }] =
    useLoginMutation({
      onCompleted,
    });
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          input: {
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

      <h4 className="mb-5 w-full text-left  font-medium">
        물리치료사를 위한 하나의 앱
      </h4>
      <div className="error-box relative w-full">
        {errors.email?.message && (
          <FormError errorMessage={errors.email?.message} />
        )}
        {errors.email?.type === "pattern" && (
          <FormError errorMessage={"Please enter a valid email"} />
        )}
        {errors.password?.message && (
          <FormError errorMessage={errors.password.message} />
        )}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 mb-5 grid w-full gap-3"
      >
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
        <input
          type="password"
          placeholder="Password"
          className="input"
          {...register("password", { required: "Password is required" })}
        />
        <Button
          type="submit"
          canClick={isValid}
          loading={loading}
          textContents={"Log in"}
        />
      </form>
    </>
  );
};