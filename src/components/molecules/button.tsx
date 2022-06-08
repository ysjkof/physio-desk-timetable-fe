import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ButtonProps {
  canClick: boolean | null;
  loading: boolean;
  textContents: string;
  isSmall?: boolean;
  isWidthFull?: boolean;
  type?: "button" | "reset" | "submit";
}

export const Button = ({
  canClick,
  loading,
  textContents,
  isSmall,
  isWidthFull,
  type = "button",
}: ButtonProps) => (
  <button
    type={type}
    className={`flex items-center justify-center rounded-md bg-green-600 py-1 tracking-widest text-white transition-colors focus:outline-none${
      isSmall ? " px-2 text-xs" : " text-base"
    }${isWidthFull ? " w-full" : ""}${
      canClick ? " bg-green-600" : " pointer-events-none opacity-50"
    }`}
  >
    {loading ? (
      <FontAwesomeIcon
        icon={faSpinner}
        fontSize={16}
        className="absolute mx-auto animate-spin"
      />
    ) : (
      ""
    )}
    <span className={`whitespace-nowrap${loading ? " text-transparent" : ""}`}>
      {textContents}
    </span>
  </button>
);
