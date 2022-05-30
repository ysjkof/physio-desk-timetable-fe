import { useForm } from "react-hook-form";
import {
  CreateClinicInput,
  useCreateClinicMutation,
} from "../../graphql/generated/graphql";
import { DashboardBtn } from "./components/button";
import { DashboardMainLayout } from "./components/dashboard-main-layout";
import { InputPriscription } from "./components/input-priscription";
import { DashboardSectionLayout } from "./components/section-layout";
import { DashboardTitle } from "./components/title";

export const CreateClinic = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm<CreateClinicInput>({ mode: "onChange" });

  const [createClinicMutation, { loading }] = useCreateClinicMutation();

  const onSubmitCreateClinic = () => {
    if (!loading) {
      const { name } = getValues();
      createClinicMutation({
        variables: { input: { name } },
      });
    }
  };

  return (
    <>
      <DashboardTitle name="병원 만들기" subText="새롭게 모임을 만듭니다" />
      <DashboardMainLayout>
        <section className="h-[15.7rem]">
          <DashboardSectionLayout
            width="md"
            children={
              <form
                onSubmit={handleSubmit(onSubmitCreateClinic)}
                className="mt-8 space-y-3"
              >
                <InputPriscription
                  label={"이름*"}
                  placeholder={"병원 이름"}
                  type="text"
                  register={register("name", {
                    required: "Name is required",
                  })}
                />
                <DashboardBtn
                  actionText={"만들기"}
                  isValid={isValid}
                  loading={loading}
                />
              </form>
            }
          />
        </section>
      </DashboardMainLayout>
    </>
  );
};
