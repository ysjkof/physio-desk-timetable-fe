import { useEffect } from 'react';
import { setToast, useStore } from '../store';
import { ChevronRight } from '../svgs';

export default function Toast() {
  const toastState = useStore((state) => state.toast);

  const closeToast = () => {
    setToast(undefined);
  };

  useEffect(() => {
    const defaultTimeout = 8_000;
    setTimeout(closeToast, toastState?.ms || defaultTimeout);
  }, [toastState]);

  if (!toastState?.messages) return null;

  return (
    <div
      className="fade fixed top-10 right-4 z-50 mb-1 flex animate-fadeout flex-col items-center bg-[#F0817A]/80 py-1"
      style={{
        ...(toastState.ms && {
          animationDuration: `${toastState.ms / 1000}s`,
        }),
      }}
      onClick={closeToast}
      onKeyDown={closeToast}
      role="button"
      tabIndex={0}
    >
      <p className="flex flex-col gap-y-2 pl-2 pr-4 text-base font-medium text-white">
        {toastState.messages.map(
          (message) =>
            message && (
              <span key={message} className="flex items-center gap-1">
                <ChevronRight strokeWidth="3px" />
                {message}
              </span>
            )
        )}
      </p>
    </div>
  );
}
