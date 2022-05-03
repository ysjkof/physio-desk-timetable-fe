import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import {
  CreateGroupInput,
  useCreateGroupMutation,
} from "../../graphql/generated/graphql";

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
      <div className="mb-4 border-b">
        <span className="font-medium">모임 만들기</span>
        <span className="text-sm text-gray-500">새롭게 모임을 만듭니다</span>
      </div>
      <form
        onSubmit={handleSubmit(onSubmitCreateGroup)}
        className="mx-auto flex max-w-sm flex-col"
      >
        <Input
          label={"이름*"}
          name={"name"}
          placeholder={"이름을 입력하세요"}
          register={register("name", {
            required: "Name is required",
          })}
          type={"name"}
          required={true}
        />
        <Button canClick={isValid} loading={loading} actionText={"만들기"} />
      </form>
    </div>
  );
};
