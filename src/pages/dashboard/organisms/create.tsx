import { useForm } from "react-hook-form";
import { Button } from "../../../components/button";
import {
  CreateClinicInput,
  useCreateClinicMutation,
} from "../../../graphql/generated/graphql";
import { InputPriscription } from "../components/input-priscription";
import { DashboardSectionLayout } from "../components/section-layout";

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
            <Button
              textContents={"만들기"}
              canClick={isValid}
              loading={loading}
            />
          </form>
        }
      />
    </section>
  );
};
