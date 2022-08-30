import { useReactiveVar } from '@apollo/client';
import { useEffect, useRef } from 'react';
import { toastVar } from '../../store';
import { cls } from '../../utils/utils';

export default function Toast() {
  const ref = useRef<HTMLButtonElement>(null);
  const { message, fade } = useReactiveVar(toastVar);

  const closeToast = () => {
    toastVar({ message: undefined, fade: false });
  };

  useEffect(() => {
    if (!message || !fade) return;
    setTimeout(closeToast, 3000);
  }, [message, fade]);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.focus();
  }, []);

  return (
    <>
      {message && (
        <div
          className={cls(
            'center position-center fixed z-50 rounded-md bg-slate-600 px-6 py-4 text-xl font-semibold text-white',
            fade ? 'animate-fadeout' : ''
          )}
        >
          {message}
          <button
            ref={ref}
            onClick={closeToast}
            className="ml-4 rounded-md border border-white px-1 font-normal outline-none ring ring-blue-400"
          >
            닫기
          </button>
        </div>
      )}
    </>
  );
}
