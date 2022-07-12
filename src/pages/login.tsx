import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  LoginInput,
  LoginMutation,
  useLoginMutation,
} from "../graphql/generated/graphql";
import { LOCALSTORAGE_TOKEN, REGEX_EMAIL } from "../variables";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { FormError } from "../components/form-error";
import { Button } from "../components/molecules/button";
import { Input } from "../components/molecules/input";

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

      <h4 className="mb-6 text-center text-base font-semibold">
        물리치료사를 위한 하나의 앱
      </h4>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 mb-5 grid w-full gap-3"
      >
        <Input
          type="email"
          placeholder="Email"
          name="email"
          label={"Email"}
          register={register("email", {
            required: "Email을 입력하세요",
            pattern: REGEX_EMAIL,
          })}
          children={
            <>
              {errors.email?.message && (
                <FormError errorMessage={errors.email.message} />
              )}
              {errors.email?.type === "pattern" && (
                <FormError errorMessage={"Email형식으로 입력하세요"} />
              )}
            </>
          }
        />
        <Input
          type="password"
          placeholder="Password"
          name="password"
          label="비밀번호"
          register={register("password", { required: "비밀번호를 입력하세요" })}
          children={
            errors.password?.message && (
              <FormError errorMessage={errors.password.message} />
            )
          }
        />
        <Button
          type="submit"
          canClick={isValid}
          loading={loading}
          textContents={"로그인"}
        />
      </form>
    </>
  );
};
