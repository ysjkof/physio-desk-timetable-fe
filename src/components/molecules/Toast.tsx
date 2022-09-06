import { useReactiveVar } from '@apollo/client';
import { useEffect } from 'react';
import { defaultToastTimeout } from '../../constants/constants';
import { toastVar } from '../../store';
import { cls } from '../../utils/utils';

export default function Toast() {
  const { messages, fade, milliseconds } = useReactiveVar(toastVar);

  const closeToast = () => {
    toastVar({});
  };

  useEffect(() => {
    if (!messages || !fade) return;
    setTimeout(closeToast, milliseconds || defaultToastTimeout);
  }, [messages, fade]);

  return (
    <>
      {messages && (
        <>
          <div
            className={cls(
              'position-center fixed z-50 flex flex-col gap-4 rounded-md bg-slate-600 px-6 py-4 text-base text-white',
              fade ? 'fade animate-fadeout' : ''
            )}
            style={{
              ...(milliseconds && {
                animationDuration: milliseconds / 1000 + 's',
              }),
            }}
          >
            {messages.map((message) => (
              <p key={message}>{message}</p>
            ))}
            <button
              onClick={closeToast}
              autoFocus
              className="rounded-md border-2 border-white px-1 outline-none focus:border-green-400"
            >
              확인
            </button>
          </div>
          <div
            className="fixed top-0 left-0 z-40 h-screen w-screen bg-black/50"
            onClick={closeToast}
          />
        </>
      )}
    </>
  );
}
