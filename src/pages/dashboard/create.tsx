import { useForm } from "react-hook-form";
import {
  CreateGroupInput,
  useCreateGroupMutation,
} from "../../graphql/generated/graphql";
import { DashboardBtn } from "./components/button";
import { InputPriscription } from "./components/input-priscription";
import { DashboardTitle } from "./components/title";

interface CreateGroupProps {}

export const CreateGroup: React.FC<CreateGroupProps> = () => {
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
          <div className="flex h-full flex-col space-y-2 bg-white p-2 shadow-cst">
            <form
              onSubmit={handleSubmit(onSubmitCreateGroup)}
              className="mx-auto my-auto max-w-sm space-y-3"
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
          </div>
        </section>
      </div>
    </div>
  );
};
