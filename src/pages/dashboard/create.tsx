import { useForm } from "react-hook-form";
import {
  CreateGroupInput,
  useCreateGroupMutation,
} from "../../graphql/generated/graphql";
import { DashboardBtn } from "./components/button";
import { InputPriscription } from "./components/input-priscription";
import { DashboardSectionLayout } from "./components/section-layout";
import { DashboardTitle } from "./components/title";

export const CreateGroup = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm<CreateGroupInput>({ mode: "onChange" });

  const [createGroupMutation, { loading }] = useCreateGroupMutation();

  const onSubmitCreateGroup = () => {
    if (!loading) {
      const { name } = getValues();
      createGroupMutation({
        variables: { input: { name } },
      });
    }
  };

  return (
    <div className="h-full">
      <DashboardTitle name="병원 만들기" subText="새롭게 모임을 만듭니다" />
      <div>
        <section className="h-[15.7rem]">
          <DashboardSectionLayout
            width="md"
            isPadding={true}
            children={
              <form
                onSubmit={handleSubmit(onSubmitCreateGroup)}
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
      </div>
    </div>
  );
};
