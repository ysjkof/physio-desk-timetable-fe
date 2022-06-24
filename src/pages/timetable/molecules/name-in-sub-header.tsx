import { cls } from "../../../libs/utils";
import { USER_COLORS } from "../../../variables";

interface NameInSubHeaderProps {
  isMe: boolean;
  name: string;
  userIndex: number;
}

export const NameInSubHeader = ({
  isMe,
  name,
  userIndex,
}: NameInSubHeaderProps) => {
  return (
    <div
      className={cls(
        "flex w-full items-center justify-center border-x-[0.5px] pt-1",
        isMe ? " font-semibold" : ""
      )}
    >
      <span
        className="mr-1 inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: USER_COLORS[0][userIndex] }}
      />
      {name}
    </div>
  );
};
