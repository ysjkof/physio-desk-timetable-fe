interface BannerProps {
  close: () => void;
}

export default function Banner({ close }: BannerProps) {
  return (
    <div className="relative bg-red-500 p-3 text-center">
      <span className="text-base font-bold text-white">
        EMAIL 인증을 하면 모든 기능을 사용할 수 있습니다
      </span>
      <button
        onClick={close}
        className="position-center-y absolute right-10 text-sm text-white hover:font-semibold"
        type="button"
      >
        닫기
      </button>
    </div>
  );
}
