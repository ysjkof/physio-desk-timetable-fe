interface ButtonProps {
  canClick: boolean | null;
  loading: boolean;
  textContents: string;
}

export const Button = ({ canClick, loading, textContents }: ButtonProps) => (
  <button
    className={`rounded-md bg-green-600 py-1 text-base tracking-widest text-white transition-colors focus:outline-none ${
      canClick ? "bg-green-600" : "pointer-events-none opacity-50"
    }`}
  >
    {loading ? "Loading..." : textContents}
  </button>
);
