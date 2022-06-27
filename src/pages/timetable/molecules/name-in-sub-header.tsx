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
        "border-r-[0.5] flex w-full items-center justify-center py-0.5 last:border-r-0",
        isMe ? " font-semibold" : ""
      )}
    >
      <span
        className="mr-1 inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: USER_COLORS[userIndex]?.deep }}
      />
      {name}
    </div>
  );
};
