import { useEffect } from 'react';
import { defaultToastTimeout } from '../constants/constants';
import { setToast, useStore } from '../store';
import { cls } from '../utils/common.utils';

export default function Toast() {
  const { messages, fade, milliseconds, bgColor } = useStore(
    (state) => state.toast
  );

  const closeToast = () => {
    setToast({});
  };

  useEffect(() => {
    if (!messages || !fade) return;
    setTimeout(closeToast, milliseconds || defaultToastTimeout);
  }, [messages, fade]);

  // TODO: 토스트는 백그라운드 필요 없음. 그냥 사라지는거야. 일정시간뒤에. 개선 고려.

  if (!messages) return null;

  return (
    <>
      <div
        className={cls(
          'position-center fixed z-50 flex flex-col gap-4 rounded-md bg-slate-600 px-6 py-4 text-base text-white',
          fade ? 'fade animate-fadeout' : ''
        )}
        style={{
          ...(milliseconds && {
            animationDuration: `${milliseconds / 1000}s`,
          }),
        }}
      >
        {messages.map((message) => (
          <p key={message}>{message}</p>
        ))}
        <button
          onClick={closeToast}
          className="rounded-md border-2 border-white px-1 outline-none focus:border-green-400"
          type="button"
        >
          확인
        </button>
      </div>
      <div
        className={cls(
          'fixed top-0 left-0 z-40 h-screen w-screen',
          bgColor ? 'bg-black/30' : ''
        )}
        onClick={closeToast}
        onKeyDown={closeToast}
        role="button"
        tabIndex={0}
      />
    </>
  );
}